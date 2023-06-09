import Head from 'next/head';
import Image from 'next/image';

import { useCallback, useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import { toast } from 'react-hot-toast';
import { BiHelpCircle } from 'react-icons/bi';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import {
  COLLECTION_NAME,
  TOKEN_NAME,
  DROPDOWN_OPTIONS
} from '../../../constants';
import { DropdownLabel } from '../../components/DropdownLabel';
import { LoadingButton } from '../../components/LoadingButton';
import { useContractContext } from '../../providers/ContractProvider';
import { api } from '../../services/api';
import { calcularDiasDesbloqueio } from '../../utils/cacLockup';
import { calcPercentage } from '../../utils/calcPercentage';
import { rarity } from '../../utils/rarity';
import {
  Button,
  ButtonGroup,
  Content,
  GridContainer,
  Header,
  InfoCard,
  Maintenance,
  Popup,
  StakingInfo,
  TokenContainer
} from './styles';

import 'react-dropdown/style.css';
import 'react-dropdown/style.css';

export default function Stake() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'unstaked' | 'staked'>('unstaked');
  const { isConnected, address } = useAccount();
  const [points, setPoints] = useState(0);
  const [selectedUnstake, setSelectedUnstake] = useState([]);
  const [selectedStake, setSelectedStake] = useState([]);

  const {
    getUnstakedNfts,
    getStakedNftsByLockup,
    unstakedNfts,
    stakedNfts,
    handleStakeNft,
    currentVault,
    setCurrentVault,
    getStakingInfo,
    totalStaked,
    handleUnstakeNft,
    totalStakedPerUser,
    rewards
  } = useContractContext();

  const getNfts = useCallback(async () => {
    await getUnstakedNfts();
  }, [getUnstakedNfts, address]);

  const getStakedNfts = useCallback(async () => {
    await getStakedNftsByLockup();
  }, [getStakedNftsByLockup, address]);

  const getStaking = useCallback(async () => {
    await getStakingInfo();
  }, [getStakingInfo, address]);

  const sendWallet = useCallback(async () => {
    await api.post(`user/${address}`);
  }, [address]);

  useEffect(() => {
    getNfts();
  }, [address]);

  useEffect(() => {
    getStakedNfts();
  }, [address]);

  useEffect(() => {
    getStaking();
  }, [address]);

  useEffect(() => {
    sendWallet();
  }, [address]);

  const dropdownOptions = DROPDOWN_OPTIONS.map((option) => {
    return {
      value: option.id,
      label:
        option.id === '0' ? (
          <DropdownLabel key={option.id} title="Select Your Vault">
            <></>
          </DropdownLabel>
        ) : (
          <DropdownLabel
            key={option.id}
            title={`${
              option.type === 'RARITY' ? 'RARITY BASED' : option.rewardRate
            } ${option.rewardRate === '1' ? 'POINT' : 'POINTS'}  PER MONKEY`}
          >
            {option.type === 'RARITY' ? 'Fixed' : ''} Lockup:{' '}
            {option.lockupPeriod} Days
          </DropdownLabel>
        )
    };
  });

  const handleDropDown = async (value: any, type: string) => {
    const currentOption = DROPDOWN_OPTIONS.find((d) => d.id === value);
    setCurrentVault({
      id: value,
      lockup: currentOption.lockupPeriod,
      type: currentOption.type
    });
  };
  const atualizarPontos = useCallback(() => {
    const calcularPontos = () => {
      const agora = new Date(); // hora atual
      let pontosTotal = 0;
      for (let i = 0; i < stakedNfts.length; i++) {
        const stakeAt = new Date(stakedNfts[i].stakeDate);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const diferencaEmMs = agora - stakeAt; // diferença em milissegundos
        const diferencaEmDias = diferencaEmMs / (24 * 60 * 60 * 1000); // diferença em dias
        const pontosNft = diferencaEmDias * stakedNfts[i].multiplier; // pontos gerados pela NFT até agora
        pontosTotal += pontosNft; // soma os pontos gerados por todas as NFTs
      }
      return pontosTotal;
    };

    const pontos = calcularPontos();
    setPoints(Number(pontos + rewards));
  }, [stakedNfts, rewards, setPoints]);

  useEffect(() => {
    const intervalId = setInterval(atualizarPontos, 1000);

    return () => clearInterval(intervalId);
  }, [atualizarPontos]);

  const handleToggleUnstake = (id) => {
    if (selectedUnstake.includes(id)) {
      const filtered = selectedUnstake.filter((s) => s !== id);
      setSelectedUnstake(filtered);
    } else {
      setSelectedUnstake([...selectedUnstake, id]);
    }
  };

  const handleToggleStake = (id) => {
    if (selectedStake.includes(id)) {
      const filtered = selectedStake.filter((s) => s !== id);
      setSelectedStake(filtered);
    } else {
      setSelectedStake([...selectedStake, id]);
    }
  };

  return (
    <>
      <Head>
        <title>{COLLECTION_NAME} Staking</title>
      </Head>

      {/* <Maintenance>
        <h1>We are under maintenance</h1>
        <h2>Your monkeys are safe</h2>
      </Maintenance> */}

      <Header>
        <div className="collection-info">
          <Image
            src="/logo.png"
            alt={`${COLLECTION_NAME} logo image"`}
            width={130}
            height={130}
          />
        </div>
        <div className="right">
          <ConnectButton />
        </div>
      </Header>
      <Content>
        <StakingInfo>
          <div>
            <InfoCard>
              <h6>Total {COLLECTION_NAME} Staked</h6>
              <strong>{calcPercentage(totalStaked, 4445).toFixed(2)}%</strong>
              <div>
                <span>{totalStaked} / 4445</span>
                <progress value={totalStaked} max={4445} />
              </div>
            </InfoCard>

            <Dropdown
              options={dropdownOptions.sort((a, b) => {
                if (a.value === currentVault?.id) return 1;
                if (b.value === currentVault?.id) return 1;
                return 0;
              })}
              onChange={(e) => {
                handleDropDown(e.value, currentVault.type);
              }}
              value={currentVault?.id}
              className="dropdown"
              controlClassName="dropdown-control"
              placeholderClassName="dropdown-placeholder"
              menuClassName="dropdown-menu"
              arrowClassName="dropdown-arrow"
              placeholder="Change Vault"
            />
          </div>

          {isConnected && (
            <div>
              <InfoCard>
                <h6>My Staked {COLLECTION_NAME}</h6>
                <strong>
                  {String(totalStakedPerUser || 0).padStart(2, '0') || '00'}
                </strong>
              </InfoCard>

              <InfoCard>
                <>
                  <h6>Estimated Rewards</h6>
                  <strong>
                    {points} {TOKEN_NAME}
                  </strong>
                </>
              </InfoCard>
            </div>
          )}
        </StakingInfo>
        <ButtonGroup>
          <Button
            isActive={activeTab === 'unstaked'}
            onClick={() => setActiveTab('unstaked')}
            disabled={!isConnected || isLoading}
          >
            Unstaked{' '}
            {!!unstakedNfts && isConnected && `(${unstakedNfts.length})`}
          </Button>
          <Button
            isActive={activeTab === 'staked'}
            onClick={() => setActiveTab('staked')}
            disabled={!isConnected || isLoading}
          >
            Staked {!!stakedNfts && isConnected && `(${stakedNfts.length})`}
          </Button>
          {isConnected && (
            <div className="staking-actions">
              <BiHelpCircle size={30} color="#FFF" className="iconHelp" />
              <Popup>
                <span>
                  7 days lockup - 1 point per day - Only withdraw after 7 days
                </span>
                <span>
                  30 days lockup - 2 points per day - Only withdraw after 30
                  days
                </span>
                <span>
                  60 days lockup - 4 points per day - Only withdraw after 60
                  days
                </span>
                <span>
                  90 days lockup - 6 points per day - Only withdraw after 90
                  days
                </span>
                <span>Rarity Based - 90 days lockup</span>
                <span>Common - 1 points per day</span>
                <span>Uncommon - 2 point per day</span>
                <span>Rare - 6.5 points per day</span>
                <span>Epic - 8 points per day</span>
                <span>Legendary - 10 points per day</span>
                <span>Mythic - 12 points per day</span>
              </Popup>
              {activeTab === 'unstaked' && (
                <>
                  {selectedUnstake.length > 0 && (
                    <LoadingButton
                      onClick={() => {
                        if (currentVault.id === '0') {
                          return toast.error('Choose a vault');
                        }
                        handleStakeNft(selectedUnstake);
                      }}
                      isLoading={isLoading}
                    >
                      Stake
                    </LoadingButton>
                  )}
                  <LoadingButton
                    onClick={() => {
                      if (currentVault.id === '0') {
                        return toast.error('Choose a vault');
                      }
                      const tokenIds = unstakedNfts.map((n) => n.tokenId);
                      handleStakeNft(tokenIds);
                    }}
                    isLoading={isLoading}
                  >
                    Stake All
                  </LoadingButton>
                </>
              )}
              {activeTab === 'staked' && (
                <>
                  {selectedStake.length > 0 && (
                    <LoadingButton
                      onClick={() => handleUnstakeNft(selectedStake)}
                      isLoading={isLoading}
                    >
                      Unstake
                    </LoadingButton>
                  )}
                  <LoadingButton
                    onClick={() => {
                      const tokenIds = stakedNfts.map((n) => n.tokenId);

                      handleUnstakeNft(tokenIds);
                    }}
                    isLoading={isLoading}
                  >
                    Unstake All
                  </LoadingButton>
                </>
              )}
            </div>
          )}
        </ButtonGroup>
        <GridContainer>
          {activeTab === 'unstaked'
            ? isConnected &&
              unstakedNfts.map((token, index) => (
                <TokenContainer key={Math.random() * index}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={selectedUnstake.includes(token.tokenId)}
                    onChange={() => handleToggleUnstake(token.tokenId)}
                  />
                  <Image
                    src={token?.image}
                    alt={token?.name}
                    width={200}
                    height={212}
                    priority
                    loader={({ src, width }) => `${src}?w=${width}`}
                  />
                  <h2>{token?.name}</h2>

                  <div className="line"></div>
                  <div className="nft-info">
                    <div>
                      Rarity:{' '}
                      {
                        rarity.find((r) => r.tokenId === Number(token.tokenId))
                          ?.raridade
                      }{' '}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (currentVault.id === '0') {
                        return toast.error('Choose a vault');
                      }
                      handleStakeNft([token.tokenId]);
                    }}
                    disabled={isLoading}
                  >
                    STAKE
                  </button>
                </TokenContainer>
              ))
            : isConnected &&
              stakedNfts.map((token, index) => (
                <TokenContainer key={Math.random() * index}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={selectedStake.includes(Number(token.tokenId))}
                    onChange={() => handleToggleStake(Number(token.tokenId))}
                  />
                  <Image
                    src={token.image}
                    alt="token"
                    width={200}
                    height={212}
                    loader={({ src, width }) => `${src}?w=${width}`}
                  />
                  <h2>{token.name}</h2>

                  <div className="line"></div>

                  <div className="nft-info">
                    <div>Rarity: {token.rarityType} </div>
                    <div>
                      Unlock in{' '}
                      {calcularDiasDesbloqueio(token.stakeDate, token.lockup)}{' '}
                      Days
                    </div>
                  </div>
                  <div>Points {token.balance === 6 ? 6.5 : token.balance}</div>

                  <button
                    onClick={() => handleUnstakeNft([token.tokenId])}
                    disabled={isLoading}
                  >
                    WITHDRAW
                  </button>
                </TokenContainer>
              ))}
        </GridContainer>
      </Content>
    </>
  );
}
