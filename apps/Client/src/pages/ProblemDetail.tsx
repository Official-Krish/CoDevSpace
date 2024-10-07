import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemStatement } from "../components/ProblemStatement";
import SubmitBar from "../components/ProblemSubmitBar";


const ProblemDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            const problem = await axios.get(`${BACKEND_URL}/api/v1/problem/getProblem/${id}`);
            console.log(problem.data);
            setProblem(problem.data);
        };
        fetchData();
    }, []);
    
    return (
        <div>
            <div className="flex flex-col">
                <main className="flex-1 py-8 md:py-12 grid md:grid-cols-2 gap-8 md:gap-12 px-2">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                    <div className="prose prose-stone dark:prose-invert">
                        <ProblemStatement description={problem.description} difficulty={problem.difficulty} />
                    </div>
                    </div>
                    <SubmitBar problem={problem} />
                </main>
            </div>
        </div>
    );
};

export default ProblemDetail;