"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
    ArrowLeft, Play, CheckCircle2, Lock, BookOpen, Video, HelpCircle,
    Award, AlertCircle,
} from "lucide-react";

function formatDuree(min: number) { return min >= 60 ? `${Math.floor(min / 60)}h${(min % 60).toString().padStart(2, "0")}` : `${min} min`; }

export default function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: moduleIdStr } = use(params);
    const moduleId = moduleIdStr as Id<"modulesFormation">;
    const { firebaseUid, operateur } = useDemoUser();

    const module = useQuery(api.formation.queries.getFormation, { moduleId });
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });
    const updateProg = useMutation(api.formation.queries.updateProgression);
    const soumettreQuiz = useMutation(api.formation.queries.soumettreQuiz);

    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizResult, setQuizResult] = useState<any>(null);

    if (module === undefined || data === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!module) {
        return (
            <div className="p-4 text-center py-16">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted" />
                <h1 className="text-xl font-bold">Formation introuvable</h1>
                <Button asChild className="mt-4"><Link href="/formation">Retour</Link></Button>
            </div>
        );
    }

    const inscription = data?.inscriptionsFormation?.find((i: any) =>
        String(i.moduleFormationId) === String(moduleId)
    );
    const isCertified = inscription?.statut === "certifie";

    const handleSubmitQuiz = async () => {
        if (!inscription) return;
        const reponses = module.quiz.map((q: any, i: number) => ({
            questionIndex: i,
            reponse: quizAnswers[i] ?? -1,
            correct: (quizAnswers[i] ?? -1) === q.reponseCorrecte,
        }));
        const result = await soumettreQuiz({ inscriptionId: inscription._id, reponses });
        setQuizResult(result);
    };

    const contenuIcons: Record<string, any> = {
        video: <Video className="w-4 h-4" />,
        texte: <BookOpen className="w-4 h-4" />,
        quiz: <HelpCircle className="w-4 h-4" />,
    };

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/formation"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
            </Button>

            {/* En-tête */}
            <div>
                <h1 className="text-xl font-bold">{module.titre}</h1>
                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{module.niveau}</Badge>
                    <Badge className="bg-primary/10 text-primary">{formatDuree(module.dureeEstimee)}</Badge>
                    {isCertified && <Badge className="bg-green-100 text-green-700">Certifié ✅</Badge>}
                </div>
            </div>

            {/* Progression */}
            {inscription && (
                <Card className="shadow-sm">
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Progression</span>
                            <span className="font-bold text-primary">{inscription.progression}%</span>
                        </div>
                        <Progress value={inscription.progression} className="h-3" />
                        {inscription.scoreQuiz !== undefined && inscription.scoreQuiz !== null && (
                            <p className="text-sm">
                                Score quiz : <span className={`font-bold ${inscription.scoreQuiz >= 70 ? "text-green-600" : "text-red-600"}`}>{inscription.scoreQuiz}/100</span>
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Contenu de la formation */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">📖 Contenu du module</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {module.contenu.map((ch: any, i: number) => {
                        const chapCalc = inscription ? Math.floor((inscription.progression / 100) * module.contenu.length) : 0;
                        const isCompleted = inscription && i < chapCalc;
                        const isCurrent = inscription && i === chapCalc;

                        return (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isCompleted ? "bg-green-50 border-green-200" : isCurrent ? "bg-blue-50 border-blue-200" : "opacity-60"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : contenuIcons[ch.type] || <Lock className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm ${isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : ""}`}>{ch.titre}</p>
                                    <p className="text-xs text-muted-foreground">{ch.type === "video" ? `${ch.duree} min` : ch.type}</p>
                                </div>
                                {isCurrent && (
                                    <Button size="sm" className="gap-1" onClick={async () => {
                                        if (inscription) {
                                            const newChap = i + 1;
                                            const newProg = Math.round((newChap / module.contenu.length) * 80);
                                            await updateProg({ inscriptionId: inscription._id, progression: newProg });
                                        }
                                    }}>
                                        <Play className="w-3 h-3" /> Continuer
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Quiz */}
            {inscription && (inscription.progression || 0) >= 80 && !isCertified && !quizResult && (
                <Card className="shadow-sm border-amber-200 bg-amber-50/30">
                    <CardContent className="p-6 space-y-4">
                        <div className="text-center">
                            <HelpCircle className="w-10 h-10 mx-auto mb-2 text-amber-600" />
                            <h2 className="text-lg font-bold">Quiz d&apos;évaluation</h2>
                            <p className="text-sm text-muted-foreground">Répondez correctement à 70% des questions pour obtenir votre certificat.</p>
                        </div>

                        {!showQuiz ? (
                            <Button size="lg" className="w-full" onClick={() => setShowQuiz(true)}>
                                Commencer le quiz ({module.quiz.length} questions)
                            </Button>
                        ) : (
                            <div className="space-y-6">
                                {module.quiz.map((q: any, qi: number) => (
                                    <div key={qi} className="space-y-2">
                                        <p className="font-medium text-sm">{qi + 1}. {q.question}</p>
                                        <div className="space-y-1">
                                            {q.options.map((opt: string, oi: number) => (
                                                <div key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                                    className={`p-3 rounded-lg border cursor-pointer text-sm transition-colors ${quizAnswers[qi] === oi ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted"}`}>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <Button size="lg" className="w-full" onClick={handleSubmitQuiz}
                                    disabled={Object.keys(quizAnswers).length < module.quiz.length}>
                                    Soumettre mes réponses
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Résultat quiz */}
            {quizResult && (
                <Card className={`shadow-sm ${quizResult.certifie ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                    <CardContent className="p-6 text-center space-y-3">
                        {quizResult.certifie ? (
                            <>
                                <Award className="w-12 h-12 mx-auto text-green-600" />
                                <h2 className="text-xl font-bold text-green-700">🎉 Félicitations !</h2>
                                <p className="text-sm text-green-600">Vous avez obtenu {quizResult.score}/100 — Certificat délivré !</p>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
                                <h2 className="text-xl font-bold text-red-700">Score insuffisant</h2>
                                <p className="text-sm text-red-600">Vous avez obtenu {quizResult.score}/100 (minimum 70). Vous pouvez réessayer.</p>
                            </>
                        )}
                        <Button asChild size="lg" className="w-full mt-2">
                            <Link href="/formation">Retour aux formations</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
