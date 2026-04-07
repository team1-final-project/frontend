import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../assets/stocker-logo.svg";
import logo2 from "../assets/stocker-logo-2.svg";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <FooterWrap>
      <Inner>
        <SignupBanner>
          <BannerText>
            <BannerTopLine>
              <BrandLogoImage2 src={logo2} alt="STOCK+er" />
              <span>회원가입 하고</span>
            </BannerTopLine>
            <span>실시간 최저가를 합리적인 쇼핑하기 !</span>
          </BannerText>

          <SignupButton type="button">Sign Up</SignupButton>
        </SignupBanner>

        <TopSection>
          <BrandArea>
            <BrandLogoLink to="/">
              <BrandLogoImage src={logo} alt="STOCK+er" />
            </BrandLogoLink>
            <BrandDesc>
              비교는 쉽게 즐거운
              <br />
              합리적 소비를 위한 트렌디한 쇼핑 !
            </BrandDesc>

            <Socials>
              <SocialButton type="button">
                <FaFacebookF size={12} />
              </SocialButton>
              <SocialButton type="button">
                <FaInstagram size={12} />
              </SocialButton>
              <SocialButton type="button">
                <FaYoutube size={12} />
              </SocialButton>
            </Socials>
          </BrandArea>

          <LinkGrid>
            <LinkColumn>
              <ColumnTitle>COMPANY</ColumnTitle>
              <FooterLink href="/">About</FooterLink>
              <FooterLink href="/">Features</FooterLink>
              <FooterLink href="/">Works</FooterLink>
              <FooterLink href="/">Career</FooterLink>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>HELP</ColumnTitle>
              <FooterLink href="/">Customer Support</FooterLink>
              <FooterLink href="/">Delivery Details</FooterLink>
              <FooterLink href="/">Terms & Conditions</FooterLink>
              <FooterLink href="/">Privacy Policy</FooterLink>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>FAQ</ColumnTitle>
              <FooterLink href="/">Account</FooterLink>
              <FooterLink href="/">Manage Deliveries</FooterLink>
              <FooterLink href="/">Orders</FooterLink>
              <FooterLink href="/">Payments</FooterLink>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>RESOURCES</ColumnTitle>
              <FooterLink href="/">Free eBooks</FooterLink>
              <FooterLink href="/">Development Tutorial</FooterLink>
              <FooterLink href="/">How to - Blog</FooterLink>
              <FooterLink href="/">Youtube Playlist</FooterLink>
            </LinkColumn>
          </LinkGrid>
        </TopSection>

        <BottomSection>
          <Copyright>© STOCK+er ALL RIGHTS RESERVED</Copyright>

          <PaymentArea>
            <PaymentBadge>toss pay</PaymentBadge>
            <PaymentBadge>pay</PaymentBadge>
          </PaymentArea>
        </BottomSection>
      </Inner>
    </FooterWrap>
  );
}

const BrandLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
`;

const BrandLogoImage = styled.img`
  height: 28px;
  width: auto;
  display: block;
  object-fit: contain;
  transform: translateY(-10px);
`;

const BrandLogoImage2 = styled.img`
  height: 20px;
  width: auto;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
`;

const FooterWrap = styled.footer`
  width: 100%;
  background: #f5f5f5;
  padding: 0 0 22px;
  border-top: 1px solid #ededed;
  overflow: visible;
`;

const Inner = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
`;

const SignupBanner = styled.div`
  width: 100%;
  background: #000;
  border-radius: 12px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: -51px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  color: #fff;
  font-size: 16px;
  line-height: 1.7;
  font-weight: 500;
`;

const BannerTopLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SignupButton = styled.button`
  min-width: 108px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: #fff;
  color: #111;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 64px;
  align-items: flex-start;
  padding: 18px 0 32px;
  border-bottom: 1px solid #dddddd;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const BrandArea = styled.div`
  width: 100%;
  max-width: 320px;
`;

const BrandLogo = styled.h2`
  margin: 0 0 12px;
  font-size: 30px;
  font-weight: 800;
  font-style: italic;
  color: #111;
  line-height: 1;
`;

const BrandDesc = styled.p`
  margin: 0;
  color: #8a8a8a;
  font-size: 13px;
  line-height: 1.8;
`;

const Socials = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const SocialButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #d7d7d7;
  border-radius: 50%;
  background: #fff;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LinkGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 36px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColumnTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.6px;
  color: #444;
`;

const FooterLink = styled.a`
  text-decoration: none;
  color: #7d7d7d;
  font-size: 13px;
  line-height: 1.7;

  &:hover {
    color: #111;
  }
`;

const BottomSection = styled.div`
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Copyright = styled.p`
  margin: 0;
  color: #9a9a9a;
  font-size: 10px;
  font-weight: 500;
`;

const PaymentArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaymentBadge = styled.div`
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #dedede;
  color: #444;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;
