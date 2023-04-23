import { BrowserProvider, Contract, ethers } from "ethers";
import { MouseEventHandler, useEffect, useState } from "react";
import MyToken from "../contracts/MyToken.json";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
export default function Home() {
  const contractAddress = "0x5d9518ae5178861427e3445a8c477647A1Eb3033";
  const contractAbi = MyToken.abi;

  const [isWalletConnected, setIswalletConnected] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        setIswalletConnected(true);
        setWallet(account);
      } else {
        toast.error(
          "Please install Metamask not found, install it and try again."
        );
        console.log("Metamask not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContractInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractAbi, signer);

        const owner = await contract.owner();
        const name = await contract.name();
        console.log(name);

        setOwner(owner);
        setName(name);

        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (account.toLowerCase() === owner.toLoserCase()) setIsOwner(true);
      } else {
        toast.error(
          "Please install Metamask not found, install it and try again."
        );
        console.log("Metamask not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractAbi, signer);

        const txn = await contract.safeMint(wallet, "");
        toast.info("Minting NFT...");
        await txn.wait();

        toast.success(
          "NFT minted succesfully.Check it out in Etherscan. Txn hash :" +
            txn.hash
        );
      } else {
        toast.error(
          "Please install Metamask not found, install it and try again."
        );
        console.log("Metamask not found");
      }
    } catch (e) {
      toast.error("Something went wrong, try again later");
      console.log(e);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (isWalletConnected) {
      getContractInfo();
    }
  }, [isWalletConnected]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        p: 1,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: { xs: "100%", md: "800px" } }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {isWalletConnected && (
            <Typography variant={isSmallScreen ? "h4" : "h3"}>
              {name}
            </Typography>
          )}

          <Typography variant={isSmallScreen ? "body2" : "body1"}>
            {isWalletConnected
              ? `Connected account: ${wallet}`
              : "To use this app, you must connect using Metamask"}
          </Typography>

          {isWalletConnected && (
            <Typography variant={isSmallScreen ? "body2" : "body1"}>
              {`Contract owner address: ${owner}`}
            </Typography>
          )}
          {isOwner ? (
            <Button variant="contained" color="secondary" onClick={mintHandler}>
              Mint NFT ✨
            </Button>
          ) : (
            <Typography variant={isSmallScreen ? "body2" : "body1"}>
              To mint this token, you must be the contract owner
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={() => {
              isWalletConnected
                ? setIswalletConnected(false)
                : checkIfWalletIsConnected();
            }}
          >
            {isWalletConnected ? "Disconnect 🔑" : "Connect with metamask 🦊"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
