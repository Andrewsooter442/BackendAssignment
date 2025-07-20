import activeTables from "../../config/activeTables";
function assignTable(req, res, next) {
  let tablesNo = activeTables.length;
  activeTables.push({ userId: req.user.id, tableNo: tablesNo + 1 });
  req.body.table_no = tablesNo + 1;
  next();
}

export default assignTable;
