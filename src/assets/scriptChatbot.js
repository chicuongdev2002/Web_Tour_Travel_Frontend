import didYouMean from "didyoumean";
import constantManage from "./constantManage";
import { valueRep } from "./constantManage";

const keyScript = Object.values(constantManage)

const scriptChatbot = (key, lstProvince) => {
    if(lstProvince){
        let check = didYouMean(key, lstProvince)
        if(!check) {
            const lst = ['TP ', 'Thành phố ', 'Tỉnh ', 'Quận ', 'Huyện ', 'Thị xã ', 'Xã '] 
            for(let i = 0; i < lst.length; i++){
                check = didYouMean(lst[i] + key, lstProvince)
                if(check) break
            }
        }
        return check? {
            keyword: 'where#' + check,
            data: [
                { me: false, content: `Bạn muốn tham gia tour ở ${check}`, createDate: new Date() },
                { me: false, content: constantManage.VIEW_TOUR, onClick: constantManage.VIEW_TOUR },
                { me: false, content: constantManage.SELECT_TOUR_TYPE, onClick: constantManage.SELECT_TOUR_TYPE },
            ]
        }  : {
            keyword: 'where',
            data: [
                { me: false, content: 'Xin lỗi tôi không biết thành phố bạn đã chọn, bạn hãy nhập lại!', createDate: new Date() },
            ]
        }
    }  
    const index = keyScript.indexOf(didYouMean(key, keyScript))
    if (index !== -1)
        return valueRep[index]
    return [
        { me: false, content: 'Xin lỗi, tôi không thể hiểu ý của bạn, bạn muốn làm gì?', createDate: new Date() },
        { me: false, content: "Tìm tour du lịch", onClick: "Tìm tour du lịch" },
        { me: false, content: "Chính sách hủy/đổi tour", onClick: true },
        { me: false, content: "Các phương thức thanh toán", onClick: true },
    ]
}

export default scriptChatbot;