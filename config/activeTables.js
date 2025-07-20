const activeTables = [];
const MAX_TABLES = 100; 

export async function assignTable(req, res, next) {
    const  ID  = req.clientObj.Id;
    console.log(req.clientObj.Id);
    console.log(activeTables);

    const existingTable = activeTables.find(table => table.userId === ID);
    if (existingTable) {
        req.clientObj.table_no = existingTable.tableNo;
        return next();
    }

    let assignedTableNo = null;
    for (let i = 1; i <= MAX_TABLES; i++) {
        const tableInUse = activeTables.some(table => table.tableNo === i);
        if (!tableInUse) {
            assignedTableNo = i;
            break;
        }
    }

    if (assignedTableNo !== null) {
        activeTables.push({ userId: ID, tableNo: assignedTableNo });
        req.clientObj.table_no = assignedTableNo;
        return next();
    } else {
        return res.status(503).json({ message: "All tables are currently occupied." });
    }
}