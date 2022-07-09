/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef, useMemo } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import toast, { Toaster } from "react-hot-toast";
// component
import WalletCard from "components/UI/walletCard";
import NFTCard from "components/UI/NFTCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// icons
import { SiEthereum } from "react-icons/si";
import { BsCoin } from "react-icons/bs";
import { TbMoodEmpty } from "react-icons/tb";
// utils
import { providerOptions } from "utils/providerOptions";
import { truncateAddress } from "utils/helpers";
// API
import { fetchAssets } from "API";

const style = {
  container: `min-h-screen gradient-bg-welcome`,
  main: `flex items-center justify-center w-full h-1/2`,
  wrapper: `flex items-start justify-between px-4 py-12 md:p-20 flex-col md:flex-row gap-0 md:gap-40`,
  header: `flex flex-col justify-start flex-1 mf:mr-10 gap-1 sm:gap-4`,
  h1: `py-1 text-white text-xl md:text-5xl text-gradient`,
  paragraph: `w-11/12 mt-5 text-base font-light text-left text-white md:w-9/12`,
  button: `flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]`,
  buttonCopy: `text-base font-semibold text-white`,
  wrapperCard: `flex flex-col items-center justify-start flex-1 gap-1 sm:gap-4`,
  listContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  midRowForm: `w-full flex justify-center text-white`,
  title: `text-5xl font-bold mb-4 `,
  statsContainer: `w-full sm:w-[44vw] flex justify-between py-4 border border-[#ffffff] rounded-xl mb-4 px-6`,
  collectionStat: `w-1/4`,
  statValue: `text-xl sm:text-3xl font-bold w-full flex items-center justify-center`,
  statName: `text-base sm:text-lg w-full text-center mt-1`,
  containerList: `flex flex-wrap justify-center`,
  wrapperEmpty: `w-full h-96 flex justify-center items-center my-4`,
  emptyList: `text-white text-center p-2`,
  wrapperIconEmpty: `flex justify-center h-9 items-center mb-4`,
  emptyText: `text-text-base sm:text-3xl`,
};

export default function Home() {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [ensAddressBalance, setEnsAddressBalance] = useState();
  const [assets, setAssets] = useState([]);
  const [owner, setOwner] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const handleChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    let params = {};
    if (value === "address") {
      params = {
        owner: account,
        order_direction: "desc",
        offset: 0,
        limit: 50,
        include_orders: true,
      };
    } else {
      params = {
        order_direction: "desc",
        offset: 0,
        limit: 50,
        include_orders: true,
      };
    }
    handleFetchAssets(params);
  };

  const web3Modal = useRef(null);

  useEffect(() => {
    web3Modal.current = new Web3Modal({
      network: "rinkeby",
      theme: "dark",
      cacheProvider: true, // optional
      providerOptions, // required
    });
  }, []);

  const welcomeUser = (
    account,
    type = "success",
    message = "",
    toastHandler = toast
  ) => {
    if (type === "success") {
      toastHandler.success(`Welcome back ${account}!`, {
        style: {
          background: "#04111d",
          color: "#fff",
        },
      });
    } else {
      toastHandler.error(message, {
        style: {
          background: "#04111d",
          color: "#fff",
        },
      });
    }
  };

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.current.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const { _hex } = await library.getBalance(accounts[0]);
      const balance = ethers.utils.formatEther(_hex);
      const formattedBalance = Number(balance).toFixed(4);
      setProvider(provider);
      setBalance(formattedBalance);
      setLibrary(library);

      const ensAddress = library?.network?.ensAddress;
      const ensAddressBalance = await library.getBalance(ensAddress);
      const ensAddressBalanceEtherFormatted = ethers.utils.formatEther(
        ensAddressBalance?._hex
      );

      const ensAddressBalanceFormatted = Number(
        ensAddressBalanceEtherFormatted
      ).toFixed(4);
      console.log("ensAddressBalanceFormatted", ensAddressBalanceFormatted);
      setEnsAddressBalance(ensAddressBalanceFormatted);

      if (accounts[0]) {
        setAccount(accounts[0]);
        welcomeUser(truncateAddress(accounts[0]));
      }
    } catch (error) {
      let message = "No wallet found!";
      if (typeof error === "string") {
        message = error;
      }
      welcomeUser(account, "error", message);
    }
  };

  const refreshState = () => {
    setAccount();
    setBalance("");
    setProvider("");
    setLibrary("");
    setAssets("");
    setOwner("");
    setEnsAddressBalance("");
  };

  const disconnect = async () => {
    await web3Modal.current?.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.current?.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (account) {
      const param = {
        order_direction: "desc",
        offset: 0,
        limit: 50,
        include_orders: true,
      };
      handleFetchAssets(param);
    }
  }, [account]);

  const handleFetchAssets = async (param) => {
    try {
      const {
        data: { assets },
      } = await fetchAssets(param);
      const owner = assets.map((el) => el.asset_contract.owner);
      const uniQueOwner = [...new Set(owner)];
      setOwner(uniQueOwner);
      setAssets(assets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const NFTs = useMemo(() => {
    if (!search) return assets;
    return assets.filter((asset) => {
      return (
        asset.name?.toLowerCase().includes(search.toLowerCase()) ||
        asset.asset_contract?.address
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        asset.creator?.user?.username
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        asset.asset_contract?.seller_fee_basis_points
          ?.toString()
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [search, assets]);

  return (
    <Box className={style.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <Head>
        <title>NFT Minter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={style.main}>
        <div className={style.wrapper}>
          <div className={style.header}>
            <Typography variant="h1" className={style.h1}>
              Discover, collect, and sell extraordinary NFTs
            </Typography>
            <p className={style.paragraph}>
              OpenSea is the world's first and largest NFT marketplace
            </p>

            {!account ? (
              <button
                type="button"
                onClick={connectWallet}
                className={style.button}
              >
                <span className={style.buttonCopy}>Connect Wallet</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={disconnect}
                className={style.button}
              >
                <span className={style.buttonCopy}>Disconnect Wallet</span>
              </button>
            )}
          </div>
          <div className={style.wrapperCard}>
            <WalletCard
              color="bg-[#2952e3]"
              title="Ethereum"
              icon={<SiEthereum fontSize={21} className="text-white" />}
              subtitle={`${
                balance
                  ? `Your Ethereum balance is: ${balance}`
                  : `Connect your wallet to see your Ethereum balance`
              } `}
            />
            <WalletCard
              color="bg-[#8945F8]"
              title="USD Coin"
              icon={<BsCoin fontSize={21} className="text-white" />}
              subtitle={`${
                ensAddressBalance
                  ? `Your USD Coin balance is: ${ensAddressBalance}`
                  : `Connect your wallet to see your USD Coin balance`
              } `}
            />
          </div>
        </div>
      </main>
      {account && (
        <>
          <div className={style.listContainer}>
            <div className={style.midRow}>
              <div className={style.title}>NFT Minter</div>
            </div>
            <div className={style.midRow}>
              <div className={style.statsContainer}>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>{assets.length}</div>
                  <div className={style.statName}>items</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>{owner.length}</div>
                  <div className={style.statName}>owners</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>
                    {library?.connection.url}
                  </div>
                  <div className={style.statName}>Connection</div>
                </div>
              </div>
            </div>
            <div className={style.midRowForm}>
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                size="small"
                className="h-8"
              >
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={filter}
                  displayEmpty
                  onChange={handleChange}
                  className="bg-white h-12 p-1 -mt-2 border-0"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="address">Your wallet address</MenuItem>
                </Select>
              </FormControl>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 500,
                }}
              >
                <IconButton sx={{ p: "5px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search and discover NFT's"
                  inputProps={{
                    "aria-label": "Search and discover NFT's",
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs sm:text-lg"
                />
              </Paper>
            </div>
          </div>

          <div className={style.containerList}>
            {NFTs.length > 0 ? (
              NFTs.map((nftItem, id) => (
                <NFTCard key={id} nftItem={nftItem} title="NFT assets" />
              ))
            ) : (
              <div className={style.wrapperEmpty}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <div className={style.emptyList}>
                    <div className={style.wrapperIconEmpty}>
                      <TbMoodEmpty fontSize={50} className="text-center" />
                    </div>
                    {search ? (
                      <>
                        <div className={style.emptyText}>Oops...</div>
                        <div className={style.emptyText}>
                          we can't find your NFT
                        </div>
                        <div className={style.emptyText}>
                          Please change your keyword!
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={style.emptyText}>Oops...</div>
                        <div className={style.emptyText}>
                          Seems you don't have any NFT on this account
                        </div>
                        <div className={style.emptyText}>
                          Please change your account!
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Box>
  );
}
