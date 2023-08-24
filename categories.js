//Coi như trong localStorage có item với key là arrCategories chứa tất cả các danh mục
//Lấy dữ liệu từ localStorage - Nếu null thì khởi tạo mảng arrCategories 
let arrCategories = JSON.parse(localStorage.getItem("arrCategories")) || [];
//Định nghĩa số dữ liệu trên trang
let recordsPerPage = 3;
//Định nghĩa action đang thực hiện
let action = "Create";
//Function thực hiện render dữ liệu theo trang
function renderData(page) {
    //Hiển thị dữ liệu cho page
    //1. Render danh sách trang
    //1.1. Tính được tổng số trang cần render
    let totalPage = getTotalPage();
    //1.2. Render danh sách trang
    let listPage = document.getElementById("listPage");
    listPage.innerHTML = "";
    for (let index = 1; index <= totalPage; index++) {
        listPage.innerHTML += `<li><a href="javascript:renderData('${index}')">${index}</a></li>`;
    }
    //1.3. Nếu ở trang 1 thì ẩn Preview, trang cuối thì ẩn Next
    if (page == 1) {
        document.getElementById("preview").style.visibility = "hidden";
    } else {
        document.getElementById("preview").style.visibility = "visible";
    }
    if (page == totalPage) {
        document.getElementById("next").style.visibility = "hidden";
    } else {
        document.getElementById("next").style.visibility = "visible";
    }
    //2. Render dữ liệu của page trên table
    //2.1. Kiểm tra page
    if (page < 1) {
        page = 1;
    }
    if (page > totalPage) {
        page = totalPage;
    }
    //2.2. Tính được indexForm và indexTo
    let indexFrom = (page - 1) * recordsPerPage;
    let indexTo = page * recordsPerPage;
    if (indexTo > arrCategories.length) {
        indexTo = arrCategories.length;
    }
    //2.3. Render dữ liệu của arrCategories từ indexForm đến indexTo lên table
    let listCatalog = document.getElementById("listCatalog");
    listCatalog.innerHTML = "";
    for (let index = indexFrom; index < indexTo; index++) {
        listCatalog.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${arrCategories[index].catalogId}</td>
                <td>${arrCategories[index].catalogName}</td>
                <td>${arrCategories[index].priority}</td>
                <td>${arrCategories[index].description}</td>
                <td>${arrCategories[index].status ? 'Active' : 'Inactive'}</td>
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
        `
    }
}
//Function tính tổng số trang theo dữ liệu
function getTotalPage() {
    return Math.ceil(arrCategories.length / recordsPerPage);
}
//Function thực hiện thêm mới dữ liệu
function createCatalog() {
    //1. Lấy dữ liệu các ô input --> đối tượng newCatalog
    let catalogId = document.getElementById("catalogId").value;
    let catalogName = document.getElementById("catalogName").value;
    let priority = document.getElementById("priority").value;
    let description = document.getElementById("description").value;
    let status = document.querySelector("input[type='radio']:checked").value == "true" ? true : false;
    let newCatalog = { catalogId, catalogName, priority, description, status };
    //2. Validate dữ liệu - mã danh mục phải là duy nhất, tên danh mục là duy nhất
    if (!validateCatalogId(catalogId)) {
        return;
    }
    if (!validateCatalogName(catalogName)) {
        return;
    }
    //3. Thêm newCatalog vào arrCategories
    arrCategories.push(newCatalog);
    //4. Lưu đè arrCategories vào localStorage
    localStorage.setItem("arrCategories", JSON.stringify(arrCategories));
    //5. Reset Form CatalogInfo
    resetFormCatalogInfo();
    //6. render lại dữ liệu trên table
    renderData(1);
}
//Function validate catalogId
function validateCatalogId(catalogId) {
    let indexFind = arrCategories.findIndex(element => element.catalogId == catalogId);
    if (indexFind >= 0) {
        //Đã tồn tại mã danh mục trong arrCategories
        document.getElementById("catalogId").style.backgroundColor = "yellow";
        alert("Mã danh mục đã tồn tại");
        return false;
    }
    document.getElementById("catalogId").style.backgroundColor = "";
    return true;
}
//Function validate catalogName
function validateCatalogName(catalogName) {
    let indexFind = arrCategories.findIndex(element => element.catalogName == catalogName);
    if (indexFind >= 0) {
        document.getElementById("catalogName").style.backgroundColor = "yellow";
        alert("Tên danh mục đã tồn tại");
        return false;
    }
    document.getElementById("catalogName").style.backgroundColor = "";
    return true;
}
//Function reset dữ liệu trên form
function resetFormCatalogInfo() {
    document.getElementById("catalogId").value = "";
    document.getElementById("catalogName").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("description").value = "";
    document.getElementById("active").checked = true;
}
//Function thực hiện cập nhật dữ liệu
function updateCatalog() {

}
//Thực hiện search dữ liệu
document.getElementById("btnSearch").addEventListener("click", function (event) {
    event.preventDefault();
    //1. Lấy dữ liệu hiện lưu trữ ở localStorage
    let listCategories = JSON.parse(localStorage.getItem("arrCategories")) || [];
    //2. Lấy dữ liệu trên ô input search
    let catalogNameSearch = document.getElementById("catalogNameSearch").value;
    //3. Tìm kiếm dữ liệu trên arrCategories
    arrCategories = listCategories.filter(element => element.catalogName.toLowerCase().includes(catalogNameSearch.toLowerCase()));
    //4. render dữ liệu lên table
    renderData(1);
})
//Thực hiện sort dữ liệu
document.getElementById("sortCatalog").addEventListener("change", function () {
    //1.  Lấy dữ liệu hiện lưu trữ ở localStorage
    let listCategories = JSON.parse(localStorage.getItem("arrCategories")) || [];
    //2. Lấy giá trị sort
    let sortData = document.getElementById("sortCatalog").value;
    if (sortData != "") {
        //3.Lấy ra tiêu chí sắp xếp sortDir (catalogName - priority) - sortBy (ASC - DESC)
        let arrSort = sortData.split("-");
        //4. Thực hiện sort
        if (arrSort[0] == "catalogName") {
            if (arrSort[1] == "ASC") {
                //Sắp xếp theo tên danh mục tăng dần
                arrCategories = listCategories.sort((a, b) => (a.catalogName > b.catalogName) ? 1 : (a.catalogName < b.catalogName) ? -1 : 0);
            } else {
                //Sắp xếp theo tên danh mục giảm dần
                arrCategories = listCategories.sort((a, b) => (a.catalogName > b.catalogName) ? -1 : (a.catalogName < b.catalogName) ? 1 : 0);
            }
        } else {
            if (arrSort[1] == "ASC") {
                //Sắp xếp theo độ ưu tiên tăng dần
                arrCategories = listCategories.sort((a, b) => a.priority - b.priority);
            } else {
                //Sắp xếp theo độ ưu tiên giảm dần
                arrCategories = listCategories.sort((a, b) => b.priority - a.priority);
            }
        }
        //5. render lại dữ liệu
        renderData(1);
    }



})
document.getElementById("btnSubmit").addEventListener("click", function (event) {
    event.preventDefault();
    if (action == "Create") {
        createCatalog();
    } else {
        updateCatalog();
    }
});

window.onload = renderData(1);