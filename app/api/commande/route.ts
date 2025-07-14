import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import villesDeTunisie from '@/lib/villes.json';

const commandeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: true },
  ville: { type: String, required: true },
  adresse: { type: String, required: true },
  quantite: { type: Number, required: true, min: 1 },
  prixTotal: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
});

const Commande = mongoose.models.Commande || mongoose.model('Commande', commandeSchema);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, prenom, tel, ville, adresse, quantite, prixTotal } = body;

    // Vérifications basiques
    if (!nom || !prenom || !tel || !ville || !adresse || quantite == null || prixTotal == null) {
      return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (!/^\d{8}$/.test(tel)) {
      return NextResponse.json({ message: 'Le numéro de téléphone doit contenir exactement 8 chiffres' }, { status: 400 });
    }

    if (typeof quantite !== 'number' || quantite < 1) {
      return NextResponse.json({ message: 'La quantité doit être un nombre supérieur ou égal à 1' }, { status: 400 });
    }

    if (typeof prixTotal !== 'number' || prixTotal < 0) {
      return NextResponse.json({ message: 'Le prix total doit être un nombre positif' }, { status: 400 });
    }

    await connectDB();

    const newCommande = new Commande({ nom, prenom, tel, ville, adresse, quantite, prixTotal });
    const savedCommande = await newCommande.save();

    // Construction des données pour ADEX, avec quantite et prixTotal utilisés
    const adexData = {
      nom_cli: `${prenom} ${nom}`,
      adr_cli: adresse,
      ville_cli: getAdexVilleCode(ville),
      tel_cli: tel,
      tel_cli2: tel,
      tel_cli3: tel,
      nbr_colis: quantite.toString(),
      ContenuColis: `Livre - Enfance x${quantite}`,
      type_colis_tab: "1",
      ttc_cmd: prixTotal.toFixed(3), // prix total formaté en string
      fragile: "0",
      codearres_ext: savedCommande._id.toString(),
      echange_cmd: "0",
      ancienne_commande_echange: "",
      produit_arecevoir: "",
      commentaire_cmd: "Commande depuis site Next.js",
    };

    const adexResponse = await fetch('https://adex.tn/api_web/commande/add_colis.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.ADEX_USERNAME}:${process.env.ADEX_PASSWORD}`
        ).toString('base64'),
      },
      body: JSON.stringify(adexData),
    });

    const adexJson = await adexResponse.json();

    if (!adexResponse.ok) {
      return NextResponse.json({
        message: "Commande enregistrée localement mais échec d'envoi à ADEX",
        adexError: adexJson,
      }, { status: 202 });
    }

    return NextResponse.json({
      message: 'Commande enregistrée et transmise à ADEX',
      id: savedCommande._id,
      adex: adexJson,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erreur API /commande:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur', error: error.message }, { status: 500 });
  }
}

function getAdexVilleCode(ville: string): string {
  const trouvee = villesDeTunisie.find(v => v.ville.toLowerCase() === ville.trim().toLowerCase());
  return trouvee ? trouvee.code : '1';
}
