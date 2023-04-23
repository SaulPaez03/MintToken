import { BrowserProvider, Contract } from "ethers";
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
  const contractAddress = "0x3f491D671491422A4bA4C7E1124c5245858e2BDE";
  const contractAbi = MyToken.abi;

  const [isWalletConnected, setIswalletConnected] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
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
          <Typography variant={isSmallScreen ? "body2" : "body1"}>
            {isWalletConnected
              ? `Connected account: ${wallet}`
              : "To use this app, you must connect using Metamask"}
          </Typography>

          {isWalletConnected && (
            <Button variant="contained" color="secondary" onClick={mintHandler}>
              Mint NFT ✨
            </Button>
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
