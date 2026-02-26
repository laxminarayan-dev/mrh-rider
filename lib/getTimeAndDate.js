const getTimeAndDate = (createdAt) => {
    const d = new Date(createdAt);

    const date = d.toLocaleDateString("en-IN");
    const time = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return { date, time };
}
export default getTimeAndDate;