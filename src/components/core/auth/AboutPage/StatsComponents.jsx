import React from "react";

const Stats = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Mentors" },
    { count: "50+", label: "Awards" },  
]

const StatsComponents = ()=>{
    return(
        <section className="bg-richblack-400 py-10">
            <div className="w-full">
                <div className="flex flex-col md:flex-row text-center gap-10 md:gap-0 justify-evenly mx-auto w-full items-center">
                    {
                        Stats.map((data, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <h1 className="text-[30px] font-semibold leading-[38px]">
                                    {data.count}
                                </h1>
                                <h2 className="text-[12px] font-semibold text-[#585D69] leading-[24px]">
                                    {data.label}
                                </h2>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default StatsComponents
