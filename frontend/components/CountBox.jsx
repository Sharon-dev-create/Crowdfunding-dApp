import React from 'react';

const CountBox = ({title, value}) => {
    return(
        <div className="flex flex-col items-center w-[150px]"> 
        <h4 className="font-epiliogue font-bold text-[30px]
        text-white p-3 bg-[#1c1c24] rounded-t-[10px] w-full
        text-center truncate">{value}</h4> 
        <p>{title}</p>
        </div>
    )
}

export default CountBox