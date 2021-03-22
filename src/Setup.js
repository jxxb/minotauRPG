// const w = 800;
// const h = 600;
// const columns = 10;
// const rows = 10;
// const cellW = w / columns;
// const cellH = h / rows;

export default class Setup {
    constructor() {
        this.w = 800;
        this.h = 600;
        this.columns = 10;
        this.rows = 10;
        this.cellW = this.w / this.columns;
        this.cellH = this.h / this.columns;
    }

    get getW() { return this.w }
    get getH() { return this.h }
    get getColumns() { return this.columns}
    get getRows() { return this.rows }
    get getCellW() { return this.cellW }
    get getCellH() { return this.cellH }
}