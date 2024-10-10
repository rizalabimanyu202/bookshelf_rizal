const buttonModeDark = document.querySelectorAll('.buttonModeDark');
const checkbox = document.getElementById("checkbox")
const tombolBuatBuku = document.getElementById("tombolBuatBuku");
const tombolDialogTambah = document.getElementById("tombolDialogTambah");
const tombolDialogSelesai = document.getElementById("tombolDialogSelesai");
const tombolDialogBatal = document.getElementById("tombolDialogBatal");
const tombolDialogHapus = document.getElementById("tombolDialogHapus");
const tombolDialogInputanKosong = document.getElementById("tombolDialogInputanKosong");
const dialogTambahBuku = document.getElementById("dialogTambahBuku");
const dialogSelesaiBuku = document.getElementById("dialogSelesaiBuku");
const dialogBatalBuku = document.getElementById("dialogBatalBuku");
const dialogHapusBuku = document.getElementById("dialogHapusBuku");
const dialogInputanKosong = document.getElementById("dialogInputanKosong");
const dialogUpdateBuku = document.getElementById("dialogUpdateBuku");
const tombolDialogUpdate = document.getElementById("tombolDialogUpdate");
const inputJudul = document.getElementById("inputJudul");
const inputAuthor = document.getElementById("inputAuthor");
const inputTahun = document.getElementById("inputTahun");
const inputMencari = document.getElementById("inputMencari");
const conX = document.querySelectorAll('.con_x');
const empty = document.getElementById('empty');
const container1 = document.querySelectorAll('.container1');
const input = document.querySelectorAll('.input');
const tombolTambah = document.querySelectorAll('.tombolTambah');
const header = document.querySelector('header');
const body = document.getElementById('body');
const localStorageKey = 'darkMode';
const tampunganDataBuku = [];
const eventRender = 'render';
let darkMode = localStorage.getItem(localStorageKey) === 'true';
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const tombolCariBuku = document.getElementById("tombolCariBuku");

class IdentifyBook {
    constructor(id, title, author, year, isComplete) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.isComplete = isComplete;
    }
}

const applyDarkModeStyles = () => {
    if (darkMode) {
        body.style.color = "white";
        body.style.backgroundColor = "black";
        header.style.borderBottom = "2px solid white";
        conX.forEach(element => {
            element.style.borderTop = "2px solid white";
        });
        container1.forEach(element => {
            element.style.border = "2px solid white";
        });
        input.forEach(element => {
            element.style.border = "2px solid white";
        });
        input.forEach(element => {
            element.style.color = "white";
        });
        tombolTambah.forEach(element => {
            element.style.border = "2px solid white";
        });
        tombolTambah.forEach(element => {
            element.style.color = "white";
        });
    } else {
        body.style.color = "black";
        body.style.backgroundColor = "white";
        header.style.borderBottom = "2px solid black";
        conX.forEach(element => {
            element.style.borderTop = "2px solid black";
        });
        container1.forEach(element => {
            element.style.border = "2px solid black";
        });
        input.forEach(element => {
            element.style.border = "2px solid black";
        });
        input.forEach(element => {
            element.style.color = "black";
        });
        tombolTambah.forEach(element => {
            element.style.border = "2px solid black";
        });
        tombolTambah.forEach(element => {
            element.style.color = "black";
        });
    }
}

const modeDark = () => {
    darkMode = !darkMode;
    localStorage.setItem(localStorageKey, darkMode);
    applyDarkModeStyles();
}

applyDarkModeStyles();

buttonModeDark.forEach(button => {
    button.addEventListener('click', modeDark);
});

const type_number = (event) => {
    let countKey = event.which || event.keycode;
    if(countKey >= 48 && countKey <= 57){
        return true;
    } else {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    tombolBuatBuku.addEventListener('click', (event) => {
        event.preventDefault();
        
        const isUpdateMode = tombolBuatBuku.hasAttribute('data-edit-id');
        const tempFirst = ["hidden", "click"];
        const tempSecond = [inputJudul, inputAuthor, inputTahun];
        const tempThird = [
            tempSecond[0].value.trim() === "",
            tempSecond[1].value.trim() === "",
            parseInt(tempSecond[2].value) > currentYear,
            tempSecond[2].value.trim() === ""
        ];
        const tempFourth = [tempThird[0] || tempThird[1] || tempThird[2] || tempThird[3]];
        const tempFive = [true, false];
        
        if (tempFourth[0]) {
            dialogInputanKosong.style.display = "flex";
            empty.style.display = "flex";
            tombolDialogInputanKosong.addEventListener(tempFirst[1], () => {
                dialogInputanKosong.style.display = "none";
                empty.style.display = "none";
            }, { once: true });
            return;
        }

        if (isUpdateMode) {
            const editId = parseInt(tombolBuatBuku.getAttribute('data-edit-id'));
            const bukuYangDiedit = findBookId(editId);
            if (bukuYangDiedit) {
                bukuYangDiedit.title = tempSecond[0].value.trim();
                bukuYangDiedit.author = tempSecond[1].value.trim();
                bukuYangDiedit.year = parseInt(tempSecond[2].value.trim());
                bukuYangDiedit.isComplete = checkbox.checked;

                dialogUpdateBuku.style.display = "flex";
                empty.style.display = "flex";
                tombolDialogUpdate.addEventListener("click", () => {
                    dialogUpdateBuku.style.display = "none";
                    empty.style.display = "none";
                }, { once: true });

                tombolBuatBuku.value = "BUAT";
                tombolBuatBuku.removeAttribute('data-edit-id');
            }
        } else {
            const newBook = new IdentifyBook(
                +new Date(),
                tempSecond[0].value.trim(),
                tempSecond[1].value.trim(),
                parseInt(tempSecond[2].value.trim()),
                checkbox.checked
            );
            tampunganDataBuku.push(newBook);

            dialogTambahBuku.style.display = "flex";
            empty.style.display = "flex";
            tombolDialogTambah.addEventListener("click", () => {
                dialogTambahBuku.style.display = "none";
                empty.style.display = "none";
            }, { once: true });
        }

        tempSecond[0].value = "";
        tempSecond[1].value = "";
        tempSecond[2].value = "";
        checkbox.checked = false;

        document.dispatchEvent(new Event(eventRender));
        checkSupportStorage();
    });

    if (JSON.parse(localStorage.getItem('bukuBuku')) !== null) {
        for(const tampung of JSON.parse(localStorage.getItem('bukuBuku'))) {
            tampunganDataBuku.push(tampung);
        }
        document.dispatchEvent(new Event(eventRender));
    }
});

document.addEventListener(eventRender, () => {
    const con = [document.getElementById('container2'), document.getElementById('container3')];
    con[0].innerHTML = '';
    con[1].innerHTML = '';
    for (const tampunganBuku of tampunganDataBuku) {
        if (!tampunganBuku.isComplete){
            con[0].appendChild(createNewBook(tampunganBuku));
        } else {
            con[1].appendChild(createNewBook(tampunganBuku));
        }
    }
});

// inputMencari.addEventListener("keyup", (event) => {
//     const tempFirst1 = ["flex", "none"];
//     const cariBuku = event.target.value.toLowerCase();
//     const listBuku = document.querySelectorAll(".container5");
//     listBuku.forEach((item) => {
//         if(item.firstChild.textContent.toLowerCase().includes(cariBuku)){
//             item.style.display = tempFirst1[0];
//         } else {
//             item.style.display = tempFirst1[1];
//         }
//     });
// });

tombolCariBuku.addEventListener("click", (event) => {
    event.preventDefault();
    const cariBuku = inputMencari.value.toLowerCase();
    const listBuku = document.querySelectorAll(".container5");
    listBuku.forEach((item) => {
        if (item.firstChild.textContent.toLowerCase().includes(cariBuku)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
});

const checkSupportStorage = () => {
    if (typeof(Storage) !== 'undefined') {
        console.log("Browser mendukung local/session Storage :)");
        localStorage.setItem('bukuBuku', JSON.stringify(tampunganDataBuku));
        document.dispatchEvent(new Event(eventRender));
        return true;
    } else {
        console.log("Browser tidak mendukung local/session Storage :(");
        return false;
    }
}

const findBookId = (idBuku) => {
    return tampunganDataBuku.find(buku => buku.id === idBuku) || null;
}

const findIdBookIndex = (idBuku) => {
    return tampunganDataBuku.findIndex(buku => buku.id === idBuku);
}

const createNewBook = (objekBuku) => {
    const con5 = document.createElement('div');
    const con6 = document.createElement('div');
    const judul = document.createElement('h2');
    const author = document.createElement('h4');
    const tahun = document.createElement('h4');
    const buttonDelete = document.createElement("input");
    const buttonEdit = document.createElement("input");
    let currentEditId = null;

    con5.classList.add("container5");
    con6.classList.add("container6");

    buttonDelete.classList.add("tombolHapus");
    buttonDelete.setAttribute("data-testid", "bookItemDeleteButton");
    buttonDelete.setAttribute("type", "submit");
    buttonDelete.setAttribute("value", "Hapus");

    buttonEdit.classList.add("tombolEdit");
    buttonEdit.setAttribute("data-testid", "bookItemEditButton");
    buttonEdit.setAttribute("type", "button");
    buttonEdit.setAttribute("value", "Edit");

    judul.innerText = objekBuku.title;
    author.innerText = "Penulis: " + objekBuku.author;
    tahun.innerText = "Tahun: " + objekBuku.year;
    con5.append(judul, author, tahun, con6);

    buttonDelete.addEventListener('click', () => {  
        dialogHapusBuku.style.display = "flex";
        empty.style.display = "flex";
        tombolDialogHapus.addEventListener("click", () => {
            dialogHapusBuku.style.display = "none";
            empty.style.display = "none";
        }, { once: true });
        if(findIdBookIndex(objekBuku.id) !== -1){
            tampunganDataBuku.splice(findIdBookIndex(objekBuku.id), 1);
            document.dispatchEvent(new Event(eventRender));
            checkSupportStorage();
            return true;
        } else {
            return false;
        }
    });

    buttonEdit.addEventListener('click', () => {
        const bookId = objekBuku.id;
        
        if (currentEditId === bookId) {
            // **Batalkan Edit**
            buttonDelete.style.display = 'block';
            inputJudul.value = "";
            inputAuthor.value = "";
            inputTahun.value = "";
            checkbox.checked = false;
            tombolBuatBuku.value = "BUAT";
            tombolBuatBuku.removeAttribute("data-edit-id");
            currentEditId = null;
            buttonEdit.textContent = 'Edit';
            tombolBuatBuku.textContent = "BUAT";
        } else {
            inputJudul.value = objekBuku.title;
            inputAuthor.value = objekBuku.author;
            inputTahun.value = objekBuku.year;
            checkbox.checked = objekBuku.isComplete;
    
            tombolBuatBuku.textContent = "UPDATE";
            buttonEdit.textContent = 'Batal Edit';
            buttonDelete.style.display = 'none';
            tombolBuatBuku.setAttribute("data-edit-id", objekBuku.id);
            currentEditId = bookId;
        }
    });

    con5.setAttribute("data-bookid", `${objekBuku.id}`);
    con5.setAttribute("data-testid", "bookItem");
    judul.setAttribute("data-testid", "bookItemTitle");
    author.setAttribute("data-testid", "bookItemAuthor");
    tahun.setAttribute("data-testid", "bookItemYear");

    if(!objekBuku.isComplete){
        const buttonKontrol = document.createElement("input");
        buttonKontrol.classList.add("tombolSelesai");
        buttonKontrol.setAttribute("data-testid", "bookItemIsCompleteButton");
        buttonKontrol.setAttribute("type", "submit");
        buttonKontrol.setAttribute("value", "Selesaikan");
        buttonKontrol.addEventListener('click', () => {
            if(findBookId(objekBuku.id) != null){
                findBookId(objekBuku.id).isComplete = true;
                document.dispatchEvent(new Event(eventRender));
                dialogSelesaiBuku.style.display = "flex";
                empty.style.display = "flex";
                tombolDialogSelesai.addEventListener("click", () => {
                    dialogSelesaiBuku.style.display = "none";
                    empty.style.display = "none";
                }, { once: true });
                checkSupportStorage();
                return true;
            } else { 
                return false;
            }
        });
        con6.append(buttonKontrol, buttonDelete, buttonEdit);
        con5.style.border = "2px solid orange";
        return con5;
    }
    if(objekBuku.isComplete){
        buttonCancel(objekBuku, con6, buttonDelete, buttonEdit);
        con5.style.border = "2px solid green";
        return con5;
    }
}

const buttonCancel = (objekBuku, container6, buttonDelete, buttonEdit) => {
    const buttonKontrol = document.createElement("input");
    buttonKontrol.classList.add("tombolBatal");
    buttonKontrol.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonKontrol.setAttribute("type", "submit");
    buttonKontrol.setAttribute("value", "Batalkan");
    buttonKontrol.addEventListener('click', () => {
        if(findBookId(objekBuku.id) != null){
            findBookId(objekBuku.id).isComplete = false;
            document.dispatchEvent(new Event(eventRender));
            dialogBatalBuku.style.display = "flex";
            empty.style.display = "flex";
            tombolDialogBatal.addEventListener("click", () => {
                dialogBatalBuku.style.display = "none";
                empty.style.display = "none";
            }, { once: true });
            checkSupportStorage();
            return true;
        } else { 
            return false;
        }
    });
    container6.append(buttonKontrol, buttonDelete, buttonEdit);
}
