import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score = 0 }: { title: string; score?: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 49
            ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    // Handle cases where sub-categories might be nested under `categories` or directly on `feedback`
    const toneAndStyleScore = feedback?.toneAndStyle?.score ?? (feedback as any)?.categories?.toneAndStyle?.score ?? 0;
    const contentScore = feedback?.content?.score ?? (feedback as any)?.categories?.content?.score ?? 0;
    const structureScore = feedback?.structure?.score ?? (feedback as any)?.categories?.structure?.score ?? 0;
    const skillsScore = feedback?.skills?.score ?? (feedback as any)?.categories?.skills?.score ?? 0;

    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback?.overallScore ?? 0} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={toneAndStyleScore} />
            <Category title="Content" score={contentScore} />
            <Category title="Structure" score={structureScore} />
            <Category title="Skills" score={skillsScore} />
        </div>
    );
};

export default Summary;