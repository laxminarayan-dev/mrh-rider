const getTimeDiffrence = ({ end, start }) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMs = endTime - startTime;
    const diffInMinutes = diffInMs / (1000 * 60);
    return diffInMinutes;
}
export default getTimeDiffrence;