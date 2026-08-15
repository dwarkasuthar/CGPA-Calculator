"use client"
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";


export default function HomePage() {
  const [semester, setSemester] = useState(2)
  const [sgpa, setSgpa] = useState<(number | "")[]>([]);
  const [cgpa, setCgpa] = useState(0)
  const [targetCgpa, setTargetCgpa] = useState<number | "">("");
  const [requiredSgpa, setRequiredSgpa] = useState<number | null>(null);


  const handleSgpaChnage = (index: number, value: string) => {
    const newSgpa = [...sgpa];

    newSgpa[index] = value === "" ? "" : Number(value);

    setSgpa(newSgpa);
  };

  const calculateCGPA = () => {
    if (semester === 0) {
      toast.error("Please select your semester.");
      return;
    }

    if (
      sgpa.length !== semester ||
      sgpa.some((value) => value === "")
    ) {
      toast.error("Please enter SGPA for all semesters.");
      return;
    }

    const total = sgpa.reduce<number>((sum, value) => {
      if (value === "") return sum;
      return sum + value;
    }, 0);

    const result = total / semester;

    setCgpa(Number(result.toFixed(2)));

    toast.success("CGPA calculated successfully!");
  };

  const calculateRequiredSgpa = () => {
    if (targetCgpa === "" || cgpa === 0) return;

    if (targetCgpa < 0 || targetCgpa > 8) {
      toast.error("Please enter a valid target CGPA (0-8).");
      return;
    }

    const totalSemester = 8;
    const remainingSemester = totalSemester - semester;

    if (remainingSemester <= 0) return;

    const currentTotal = cgpa * semester;
    const requiredTotal = targetCgpa * totalSemester;

    const requiredSGPA =
      (requiredTotal - currentTotal) / remainingSemester;

    setRequiredSgpa(requiredSGPA);

    toast.success("CGPA calculated successfully!");
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A]">
        <h1 className="flex items-center text-2xl font-bold mb-1">
          <Image
            src="/education-cap.png"
            alt="education cap"
            width={70}
            height={50}
          />
          CGPA Calculator
        </h1>
        <h3 className="mb-3">Calculate your CGPA instantly for up to 8 semesters</h3>

        <div className="border pb-10  border-black rounded-3xl bg-[#1E293B]/90 p-8 shadow-2xl">
          <h1 className="mb-3">Select Number of Semester</h1>
          {/* <label className="mb-3">Select Number of Semester</label> */}

          <form>
            <select value={semester}
              onChange={(e) => {
                setSemester(Number(e.target.value))
                setSgpa([]);
                setCgpa(0);
                setTargetCgpa("");
                setRequiredSgpa(null);
              }}
              className="flex text-white border border-cyan-400 w-full mb-2 bg-transparent rounded-lg pl-1 h-9 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">


              <option value="0" className="text-black">Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem} className="text-black">
                  {sem}
                </option>
              ))}
            </select>


            <div>
              {Array.from({ length: semester }, (_, index) => (
                <div key={index}>
                  {/* <h3>Semester {index + 1}</h3> */}
                  <input type="number"
                    min={0}
                    max={8}
                    step={0.01}
                    value={sgpa[index] ?? ""}
                    onChange={(e) => handleSgpaChnage(index, e.target.value)}
                    className="border pl-2 border-cyan-400 w-full text-white rounded-lg h-9 mb-2 bg-transparent outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" placeholder={`Enter SGPA ${index + 1}`} />
                </div>
              ))}


              <button className="group relative h-12 w-full overflow-hidden rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98]"
                type="button"
                onClick={calculateCGPA}>
                Calculate CGPA</button>


              <div>
                <h1 className="text-xl font-bold flex justify-center items-center mt-5 text-gray-50">CGPA : {cgpa.toFixed(2)}</h1>
                <hr className="mt-1" />
              </div>
            </div>
            <div>
              <h1 className="flex justify-center items-center m-4 font-bold ">
                <Image src="/target-icon.png" alt="target image" width={35} height={35}></Image>
                Target CGPA Planner</h1>


              <input type="number" placeholder="Enter required CGPA"
                value={targetCgpa}
                step={0.01}
                onChange={(e) =>
                  setTargetCgpa(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border pl-2 border-cyan-400 w-full text-white rounded-lg h-9 mb-2 bg-transparent outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />


              <button type="button"
                onClick={calculateRequiredSgpa}
                className="group relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98]" >
                Calculate required SGPA</button>



              {requiredSgpa !== null && (
                <div className="mt-5 text-center">
                  {requiredSgpa > 8 ? (
                    <p className="font-semibold text-red-300">
                      Target CGPA cannot be achieved.
                      <br />
                      Required SGPA: {requiredSgpa.toFixed(2)}
                    </p>
                  ) : requiredSgpa <= 0 ? (
                    <p className="font-semibold text-green-300">
                      Your current CGPA is already enough for this target 🎉
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-gray-50 text-green-300">
                      Required SGPA: {requiredSgpa.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div >
    </>
  );
}