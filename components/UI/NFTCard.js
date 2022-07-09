import { memo } from "react";
import { BiHeart } from "react-icons/bi";
import Image from "next/image";

const style = {
  wrapper: `bg-[#303339] w-[16rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center relative`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  assetDescr: `font-bold text-lg mt-2 truncate`,
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
            src={`${nftItem.image_preview_url}`}
            alt={nftItem.name}
            className={style.nftImg}
            layout="fill"
          />
        </div>
        <div className={style.details}>
          <div className={style.info}>
            <div className={style.infoLeft}>
              <div className={style.collectionName}>{title}</div>
              <div className={style.assetName}>{nftItem.name}</div>
              <div className={style.assetDescr}>
                {nftItem.description ?? ""}
              </div>
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
