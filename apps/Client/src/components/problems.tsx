import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config";

export function Problems() {
    const [problems, setProblems] = useState<any[]>([]);
    
    useEffect(() => {
        async function fetchProblems() {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/problem/getProblems`);
                setProblems(response.data);
            } catch (error) {
                console.error("Error fetching problems:", error);
            }
        }
        fetchProblems();
    }, []);

    return (
        <section className=" py-8 md:py-22">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Problems</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Sharpen Your Skills with Diverse Challenges
                    </p>
                </div>
                <div>
                </div>
                <div className="mt-6">
                    <div className="border-2  rounded-md overflow-hidden dark:bg-background">
                        <div className="flex  bg-muted font-bold">
                            <div className="px-2 py-2 flex-1">Name</div>
                            <div className="px-2 py-2 text-center w-[100px]">Difficulty</div>
                            <div className="px-2 py-2 text-center w-[100px]">Status</div>
                        </div>
                        {problems.map((problem) => (
                            <Link
                                to={`/problem/${problem.id}`}
                                className="flex text-muted-foreground hover:bg-muted/100 duration-300"
                                key={problem.id}
                            >
                                <div className="px-2 py-2 flex-1 font-medium capitalize">
                                    {problem.title.split("-").join(" ")}
                                </div>
                                <div className="px-2 py-2 text-center w-[100px] capitalize">
                                    {problem.difficulty.toLocaleLowerCase()}
                                </div>
                                <div className="px-2 py-2 text-center w-[100px]">-</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {problems.length === 0 && (
                    <div className="flex flex-col items-center md:mt-12">
                        <h1 className="lg:text-4xl md:text-2xl text-lg text-muted-foreground font-bold">
                            No problems found{" "}
                        </h1>
                    </div>
                )}
            </div>
        </section>
    );
}
