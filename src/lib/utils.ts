
export const normalizeDate =(dateStr:string ): string =>{
    const datetime = dateStr;
    const dateOnly = new Date(datetime).toISOString().split("T")[0];
    return dateOnly;
};

export const normalizeDate2 =(dateStr:string ) =>{
    const birtdate = new Date(dateStr).toISOString()
    const birtdate2 = new Date(birtdate)

    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
     year: "numeric",
    });
    const formattedDate = formatter.format( birtdate2);
    return formattedDate
};

const currentWorkWeek = ()=>{
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);

    if (dayOfWeek === 0) {
        startOfWeek.setDate(today.getDate() + 1);
    }
    if (dayOfWeek === 6){
        startOfWeek.setDate(today.getDate() +2);
    } else {
        startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
    }

    startOfWeek.setHours(0, 0, 0, 0);

    // const endOfWeek = new Date(startOfWeek);
    // endOfWeek.setDate(startOfWeek.getDate() + 4);
    // endOfWeek.setHours(23, 59, 59, 999);

    return  startOfWeek;
};

export const adjustScheduleTiCurrentWeek = (
    lessons:{title: string; start:Date; end:Date}[]
):{title:string; start:Date; end:Date}[] =>  {
    
    const startOfWeek  = currentWorkWeek();
    return lessons.map(lesson =>{
        const lesssonDayOfWeek = lesson.start.getDate();
        const daysFromMonday = lesssonDayOfWeek === 0 ? 6 :lesssonDayOfWeek -1;
        const adjustedStartDate = new Date(startOfWeek);
        adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
        adjustedStartDate.setHours(
            lesson.start.getHours(),
            lesson.start.getMinutes(),
            lesson.start.getSeconds()
        );
        const adjustedEndDate = new Date(adjustedStartDate);
        adjustedEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds()
        );

        return{
            title: lesson.title,
            start: adjustedStartDate,
            end: adjustedEndDate,
        };
    });
};

