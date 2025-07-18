/* eslint-disable */

"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import villesDeTunisie from '@/lib/villes.json';


export default function LivrePage() {
  const showForm = true;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantite, setQuantite] = useState(1); // Nouvelle valeur
  const PRIX_LIVRE = 30;
  // const FRAIS_LIVRAISON = 8;
  //const prixTotal = quantite * PRIX_LIVRE + FRAIS_LIVRAISON;
  const prixTotal = quantite * PRIX_LIVRE;
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    tel: "",
    ville: "",
    adresse: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(formData.tel)) {
      alert("Le numéro de téléphone doit contenir exactement 8 chiffres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(formData),
        body: JSON.stringify({ ...formData, quantite, prixTotal }),

      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        let errorMessage = "Erreur lors de l'enregistrement";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Erreur serveur: ${res.status} ${res.statusText}`;
        }
        alert(errorMessage);
        console.error("Erreur backend:", { status: res.status, statusText: res.statusText });
      }
    } catch (err: any) {
      alert(`Erreur réseau: ${err.message || "Erreur réseau ou serveur"}`);
      console.error("Erreur réseau:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center ">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src="/livre.jpg"
            alt="Couverture du livre"
            className="w-full md:w-1/2 rounded-xl w-full object-cover"
          />

          <div className="flex-1">

            <p className="text-gray-700 mb-6 leading-relaxed">
              Un témoignage sensible et authentique sur les souvenirs d’enfance, les rêves, les blessures et la résilience. Un récit intime qui touche au cœur.
            </p>

            {showForm && !submitted && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
                <div className="grid grid-cols- md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    onChange={handleChange}
                    value={formData.nom}
                    required
                    className="w-full text-base text-gray-800 font-medium border-b border-gray-300 px-4 py-0 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    onChange={handleChange}
                    value={formData.prenom}
                    required
                    className="w-full text-base text-gray-800 font-medium border-b border-gray-300 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="tel"
                    name="tel"
                    placeholder="Téléphone"
                    onChange={handleChange}
                    value={formData.tel}
                    required
                    pattern="^\d{8}$"
                    title="Le numéro doit contenir exactement 8 chiffres"
                    className="w-full text-base text-gray-800 font-medium border-b border-gray-300 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <select
                    name="ville"
                    onChange={handleChange}
                    value={formData.ville}
                    required
                    className="w-full text-sm text-gray-800 font-medium rounded-lg border-b border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Votre ville</option>
                    {villesDeTunisie.map(({ ville, code }) => (
                      <option key={code} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </select>


                </div>

                <textarea
                  name="adresse"
                  placeholder="Adresse exacte"
                  onChange={handleChange}
                  value={formData.adresse}
                  required
                  rows={3}
                  className="w-full text-base text-gray-800 font-medium border-b border-gray-300 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {/* <div className="flex gap-4"><label htmlFor="quantite" className="text-gray-700 font-medium min-w-[80px]">
                    Prix :60.000 DT
                  </label>
                
                <label htmlFor="quantite" className="text-gray-700 font-medium min-w-[80px]">
                    Livraison gratuite
                  </label></div> */}

                {/* <div className="flex items-center gap-1 mt-2">
                  <label htmlFor="quantite" className="text-gray-700 font-medium min-w-[20px]">
                    Quantité :
                  </label>
                  <input
                    id="quantite"
                    type="number"
                    value={quantite}
                    min={1}
                    onChange={(e) => setQuantite(Number(e.target.value))}
                    required
                    className="w-20 text-center text-gray-800 font-medium rounded-lg border border-gray-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ml-4"
                  />
                </div> */}
             <div className="flex items-center gap-3 mt-2">
  <label htmlFor="quantite" className="text-gray-700 font-medium min-w-[80px]">
    Quantité :
  </label>

  <button
    type="button"
    onClick={() => setQuantite(prev => Math.max(1, prev - 1))}
    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded-full"
  >
    −
  </button>

  <input
    id="quantite"
    type="number"
    value={quantite}
    min={1}
    onChange={(e) => setQuantite(Math.max(1, Number(e.target.value)))}
    className="w-16 text-center text-gray-800 font-medium rounded-lg border border-gray-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition
      [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none 
      [appearance:textfield]"
  />

  <button
    type="button"
    onClick={() => setQuantite(prev => prev + 1)}
    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded-full"
  >
    +
  </button>
</div>



                <div className="ml-auto font-semibold text-lg text-green-700 ">
                  Prix total : {prixTotal.toFixed(3)} DT
                </div>



                <button
                  type="submit"
                  className={`bg-green-600 text-white w-full py-3 rounded-xl hover:bg-green-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Commander"}
                </button>
              </form>
            )}

            {submitted && (
              <div className="mt-6 flex items-center gap-3 text-green-700 font-semibold text-lg">
                <CheckCircle className="w-6 h-6" />
                Merci pour votre commande ! Nous vous contacterons bientôt.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}