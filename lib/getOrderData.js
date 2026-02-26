export const getOrdersByStatus = (orders) => {
    const grouped = orders.reduce((acc, order) => {
        if (!acc[order.status]) {
            acc[order.status] = [];
        }
        acc[order.status].push(order);
        return acc;
    }, {});
    return grouped;
}

export const devideOrdersByDate = (orders) => {
    const datedOrders = orders.reduce((acc, order) => {
        let date = new Date(order.createdAt);
        let day = date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
        let dateKey = day
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        } acc[dateKey].push(order);
        return acc;
    }, {});
    return datedOrders;
}

export const getWeeklyData = (orders) => {
    let today = new Date();
    let last7Days = Array.from({ length: 7 }, (_, i) => {
        let date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    }).reverse();
    let data = last7Days.map(day => {
        let count = orders.filter(order => {
            let orderDate = new Date(order.createdAt);
            let orderDay = orderDate.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
            return orderDay === day;
        }).length;
        return { day, count };
    });
    return data;
}