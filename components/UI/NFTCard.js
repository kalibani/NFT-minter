import { memo } from "react";
import { BiHeart } from "react-icons/bi";
import Image from "next/image";

import placeHolderImage from "assets/images/placeholder-image.png";

const style = {
  wrapper: `bg-[#303339] w-[16rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-3/5 w-full overflow-hidden flex justify-center items-center relative`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap truncate`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `truncate font-bold text-base mt-2`,
  assetDescr: `font-bold text-base mt-2 text-ellipsis overflow-hidden truncate`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
};

const NFTCard = ({ nftItem, title }) => {
  return (
    <div className={style.wrapper}>
      <a target="_blank" href={nftItem.permalink} rel="noopener noreferrer">
        <div className={style.imgContainer}>
          <Image
            src={nftItem.image_preview_url ?? placeHolderImage}
            alt={nftItem.name}
            className={style.nftImg}
            blurDataURL
            placeholder="blur"
            layout="fill"
          />
        </div>
        <div className={style.details}>
          <div className={style.info}>
            <div className={style.infoLeft}>
              <div className={style.collectionName}>{title}</div>
              <p className={style.assetName}>{nftItem.name}</p>
              <p className={style.assetDescr}>{nftItem.description ?? ""}</p>
            </div>
          </div>
          <div className={style.likes}>
            <span className={style.likeIcon}>
              <BiHeart />
            </span>{" "}
            {nftItem.likes}
          </div>
        </div>
      </a>
    </div>
  );
};

export default memo(NFTCard);
