import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircleQuestion, Phone, Mail } from "lucide-react";

export default function FAQPage() {
    const categories = [
        {
            title: "Inscription & Mon Compte",
            icon: "👤",
            questions: [
                { q: "L'inscription sur AGASA-Pro est-elle payante ?", a: "Non, la création de compte est totalement gratuite. Vous ne payez que lors de la soumission d'une demande officielle (Agrément, Importation, Analyse)." },
                { q: "Je n'ai pas d'adresse e-mail, puis-je m'inscrire ?", a: "Absolument. Un simple numéro de téléphone gabonais (+241) suffit. Vous recevrez un mot de passe temporaire par SMS pour vous connecter." },
                { q: "Pourquoi le système rejette-t-mon numéro de téléphone ?", a: "Vérifiez que votre numéro ne comporte pas l'indicatif +241 (qui est déjà pré-sélectionné) et qu'il comporte bien les 9 chiffres locaux (ex: 077 12 34 56)." },
                { q: "Comment modifier le nom de mon Établissement ?", a: "Allez dans 'Mon Espace' > 'Mes Informations', cliquez sur l'onglet 'Établissements' et sélectionnez 'Modifier'. Attention, si l'établissement a un agrément en cours, cette modification devra être validée par un agent AGASA." }
            ]
        },
        {
            title: "Demandes d'Agrément Sanitaire",
            icon: "📜",
            questions: [
                { q: "Quelles sont les pièces à fournir pour un Agrément ?", a: "Pour une Catégorie 2 ou 3 : Votre RCCM (ou Fiche Circuit), votre pièce d'identité, et le plan des locaux (un simple croquis suffit pour les CAT 3). Pour les industriels (CAT 1), le plan HACCP complet est requis." },
                { q: "Combien de temps faut-il pour obtenir l'Agrément ?", a: "Une fois le dossier complet soumis et payé en ligne, le délai légal maximum d'instruction est de 30 jours (incluant l'inspection physique). La décision vous est notifiée par SMS et sur la plateforme." },
                { q: "Mon inspection est-elle payante ?", a: "L'inspection initiale est incluse dans le forfait payé lors de la soumission. Cependant, en cas de non-conformité grave entraînant une contre-visite, des frais de déplacement peuvent s’appliquer." },
            ]
        },
        {
            title: "Paiements & Quittances",
            icon: "💳",
            questions: [
                { q: "Quels sont les moyens de paiement acceptés ?", a: "Vous pouvez payer en ligne via Airtel Money, Moov Africa, par carte bancaire (Visa/Mastercard) ou effectuer un virement bancaire pour les montants importants. Aucun paiement en espèces n'est accepté dans les bureaux de l'AGASA." },
                { q: "Mon paiement Airtel Money affiche 'Échoué', que faire ?", a: "Vérifiez que votre solde est suffisant. Assurez-vous d'approuver la transaction sur votre téléphone rapidement après avoir reçu le pop-up USSD." },
                { q: "Comment obtenir mon reçu de paiement ?", a: "Dès que le paiement est confirmé, une quittance au format PDF (avec QR code) est générée dans votre espace 'Mon Dossier' > 'Historique de Paiements'." }
            ]
        },
        {
            title: "Importation (DPI, AMC)",
            icon: "🚢",
            questions: [
                { q: "Je dois déclarer 20 factures, dois-je faire 20 dossiers ?", a: "Non, vous regroupez l'ensemble des manifestes/factures associés à un seul arrivage (Avis d'Arrivée) dans le même dossier." },
                { q: "J'ai perdu mon AMC papier au Port", a: "Il n'y a plus de papier ! L'AMC est 100% numérisée. Connectez-vous sur votre téléphone, allez dans la demande correspondante et montrez le QR Code à l'inspecteur sur place." }
            ]
        }
    ];

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            {/* EN-TÊTE */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                    <MessageCircleQuestion className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Foire Aux Questions (FAQ)</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Retrouvez ici les réponses aux questions les plus fréquentes posées par les opérateurs économiques utilisant AGASA-Pro.
                </p>
            </div>

            {/* SECTIONS FAQ */}
            <div className="space-y-12">
                {categories.map((cat, i) => (
                    <div key={i} className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-muted px-6 py-4 flex items-center gap-3 border-b">
                            <span className="text-2xl">{cat.icon}</span>
                            <h2 className="text-xl font-bold">{cat.title}</h2>
                        </div>
                        <div className="p-2 sm:p-4">
                            <Accordion type="single" collapsible className="w-full">
                                {cat.questions.map((faq, j) => (
                                    <AccordionItem key={j} value={`${i}-item-${j}`}>
                                        <AccordionTrigger className="text-left font-medium px-4 text-base">{faq.q}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground px-4 pb-4 leading-relaxed">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOX CONTACT SUPPORT */}
            <div className="mt-20 bg-primary text-primary-foreground rounded-3xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
                {/* Fausse texture de fond */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 w-full">
                    <h2 className="text-3xl font-bold mb-4">Une question technique ou réglementaire ?</h2>
                    <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
                        Notre centre de support et nos experts sont disponibles du Lundi au Vendredi de 08h00 à 15h30.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                            <Phone className="w-6 h-6" />
                            <div className="text-left w-full">
                                <span className="block text-xs uppercase tracking-wider opacity-80 font-bold">Appel gratuit</span>
                                <span className="block text-xl font-bold tracking-widest">011 76 99 XX</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 w-fit">
                            <Mail className="w-6 h-6" />
                            <div className="text-left">
                                <span className="block text-xs uppercase tracking-wider opacity-80 font-bold">Par e-mail</span>
                                <span className="block text-lg font-bold">support@agasa.ga</span>
                            </div>
                        </div>
                    </div>

                    <Button asChild variant="secondary" size="lg" className="h-14 px-8 text-black font-bold">
                        <Link href="/inscription">Aller sur mon Espace Opérateur</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
