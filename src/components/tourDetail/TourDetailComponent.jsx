import React from 'react'
import { useNavigate } from 'react-router-dom';
import SliderPaging from '../../components/slider/SliderPaging';

function TourDetailComponent({ images }) {
  const mainImgDimension = 500
  const thumbImgDimension = 70
  const navigate = useNavigate();
  return (
    <div className='divRowBetween'>
          <div className='w-50 px-3' style={{overflow: 'hidden', height: mainImgDimension + thumbImgDimension}}>
            <SliderPaging images={images} mainImgDimension={{ width: mainImgDimension*1.5, height: mainImgDimension}} 
              thumbImgDimension={{ width: thumbImgDimension, height: thumbImgDimension }}/>
          </div>
          <div className='w-50 px-3 d-flex flex-column'>
            <div className='border p-3 shadow rounded d-flex align-items-start flex-column' style={{ flexGrow: 1, height: mainImgDimension + thumbImgDimension}}>
                <h2>Du lịch Phú Quốc</h2>
                <s className='h4 text-muted'>10,000,000đ</s>
                <h3 className='text-danger'>5,000,000đ</h3>
                <p className='text-justify'>Phú Quốc, còn gọi là "Đảo Ngọc", là điểm du lịch nổi tiếng với những bãi biển tuyệt đẹp như Bãi Sao và Bãi Dài, nước biển trong xanh và cát trắng mịn. Đảo còn có Vườn quốc gia với hệ sinh thái đa dạng, cáp treo Hòn Thơm dài nhất thế giới, và làng chài Hàm Ninh yên bình. Du khách có thể thưởng thức hải sản tươi ngon và khám phá văn hóa địa phương tại Dinh Cậu và chợ đêm Phú Quốc.</p>
                <p>Đánh giá:</p>
                <button className='btn btn-primary' onClick={()=>{navigate('/booking')}}>Đặt tour</button>
            </div>
        </div>
    </div>
  )
}

export default TourDetailComponent