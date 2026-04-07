import React, { useState } from 'react';
import './ProductImagesPage'; // 위에서 만든 CSS 파일을 불러옵니다!

// --- [Mock Data] --- (이전 데이터와 동일)
const productInfo = { /* 생략 - 기존 데이터 사용 */ };
const mockReviews = Array(6).fill({ /* 생략 - 기존 데이터 사용 */ });

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState('https://via.placeholder.com/400x500?text=Shin+Ramyun');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('상품평');

  const tabs = ['상품상세', '상품평(788,617)', '상품문의', '교환/반품 안내'];

  return (
    <div className="pdp-container">
      
      {/* 상단: 상품 기본 정보 */}
      <div className="product-top">
        <div className="product-image-box">
          <img src={activeImage} alt="상품 이미지" />
        </div>

        <div className="product-info">
          <h1 className="product-title">{productInfo.title}</h1>
          <div className="product-rating">
            <span className="stars">★★★★☆</span>
            <span>{productInfo.rating}/5</span>
          </div>

          <div className="product-price-wrap">
            <span className="price-current">{productInfo.discountPrice}원</span>
            <span className="price-original">{productInfo.originalPrice}원</span>
            <span className="price-discount">{productInfo.discountRate}</span>
          </div>

          <div className="product-desc">{productInfo.description}</div>

          <ul className="product-specs">
            <li>중량 : {productInfo.specs.weight}</li>
            <li>칼로리 : {productInfo.specs.calories}</li>
            <li>소비기한 : {productInfo.specs.shelfLife}</li>
            <li>출시년도 : {productInfo.specs.releaseYear}</li>
          </ul>

          <div className="cart-action">
            <div className="quantity-control">
              <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="qty-num">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="btn-add-cart">Add to Cart</button>
          </div>
        </div>
      </div>

      {/* 중단: 탭 네비게이션 */}
      <ul className="tabs">
        {tabs.map((tab, index) => {
          const tabName = tab.split('(')[0];
          return (
            <li 
              key={index}
              className={`tab-item ${activeTab === tabName ? 'active' : ''}`}
              onClick={() => setActiveTab(tabName)}
            >
              {tab}
            </li>
          );
        })}
      </ul>

      {/* 하단: 상품평 리스트 */}
      {activeTab === '상품평' && (
        <div>
          <div className="reviews-grid">
            {mockReviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <div>
                  <div className="review-header">
                    <span className="stars">★★★★★</span>
                    <button style={{background:'none', border:'none', cursor:'pointer'}}>•••</button>
                  </div>
                  <div className="review-author-info">
                    <span className="author-name">{review.author}</span>
                    <span className="author-email">({review.email})</span>
                    {review.isVerified && <span className="verified-badge">✔</span>}
                  </div>
                  <div className="review-images">
                    {review.images.map((img, i) => (
                      <img key={i} src={img} alt="review" />
                    ))}
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
                <div className="review-date">Posted on {review.date}</div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="pagination">
            {['<<', '<', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '>', '>>'].map((page, idx) => (
              <button key={idx} className={`page-btn ${page === '1' ? 'active' : ''}`}>
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}