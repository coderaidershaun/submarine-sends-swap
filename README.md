# How to Run

## Install Packages

Once you have downloaded this code package, you will need to install dependancies. For this,
we are using yarn instead of npm. This is because the yarn installation seems to have worked better
with ethers libraries in the developers previous experience.

If you do not have yarn globally installed, you can do so by typing the following into your command terminal:

```shell
npm install --global yarn
```

Also make sure you have ts-node installed globally to. This makes running typescript much easier in projects.

```shell
yarn add --global ts-node
```

Change into your project folder where this code package is saved if not done so already:

```shell
cd myprojectfolder
```

Then, you will need to install the exact packages as showin in the package.json file. Do so by typing:

```shell
yarn --exact
```

## Update Environment Variables

Create an environment variable file (remember the '.' is important)

```shell
touch .env
```

Now add the following to your .env file. Keep the TOKEN_SWAP_ADDRESS exactly the same as below. This is the USDC address
and is the test token we will be swapping (as widely available on testnet).

```plain
ACCOUNT_ADDRESS = "ENTER YOUR ACCOUNT ADDRESS"
PRIVATE_KEY = "ENTER YOUR PRIVATE KEY WITH 0X"
PROVIDER_URL = "ENTER YOUR INFURA OR ALCHEMY GOERLI PROVIDER"

REVEAL_ADDRESS=(Leave blank for now)

FACTORY_ADDRESS=(Leave blank for now)

TOKEN_SWAP_ADDRESS=0x07865c6e87b9f70255377e024ace6630c1eaa37f

UNIQUE_INT=0 (Leave 0 for now)

SUBMARINE_ADDRESS=(Leave blank for now)
```

## Test Hardhat on Localhost

Clean any previosuly saved artifacts.

```shell
npx hardhat clean
```

Compile solidity code

```shell
npx hardhat compile
```

Test the code

```shell
npx hardhat test
```

You should see green ticks against each test. The code for this is saved in the 'test.ts' folder.

This code is very useful to understand how to interfact with the solidity smart contracts.

# Run on the Blockchain

## Send Funds

Ensure you have sent your Metamask some Goerli from the Goerli testnet faucet. You can use any testnet, but this code
has been built with Goerli tokens and contracts in mind.

## Run Steps

For this to work, your .env environment variables with provider url must be setup per the steps above.

In the Scripts folder, you will notice there are 7 steps. This is to help understand and see the code for each step in
running such a Submarine type send in real-life. It will make things much easier to follow and understand.

### Step 1

To run each step, just type the following with the step number into your command terminal:

```shell
npx hardhat run --network goerli scripts/step1.ts
```

Wait a minute or so and you will now have a Reveal Contract address and a Factory Contract address.

Add these to the empty space in your .env file. For example:

```shell
REVEAL_ADDRESS=0x6666739c5348574A899D768EadDE3Dcc1a42fA08
FACTORY_ADDRESS=0x508956F5843f90cc14AE00DC09395E9723721353
```

Your addresses might look different to the above. That is totally ok. As long as they are there.

```shell
npx hardhat run --network goerli scripts/step2.ts
```

### Step 2

Running Step 2 gives you the Submarine contract address (predicted) and creates the contract.

Check the transaction on the Goerli etherscan to ensure it completes before moving to step 3.

Equally, remember to update the predicted Submarine Contract address in your .env file as shown below. Do not forget this.

```shell
npx hardhat run --network goerli scripts/step2.ts
```

.env example after running the above (manually paste in your Submarine contract address):

```plain
SUBMARINE_ADDRESS=0x091eE557493f3e3175061041843301148AB4135d
```

### Step 3

Step 3 ensures that the actual contract address for the Submarine contract matches the predicted one.

This is a crucial check as it ensures all inputs into your contract and off-chain calls sync up nicely.

```shell
npx hardhat run --network goerli scripts/step3.ts
```

### Step 4

Step 4 simply sends Ether to your Submarine contract address

```shell
npx hardhat run --network goerli scripts/step4.ts
```

Again, check the transaction on the Goerli Etherscan before moving on to the next step.

### Step 5

This shows that the funds have arrived in the Submarine Contract address:

```shell
npx hardhat run --network goerli scripts/step5.ts
```

### Step 6

Executing this will reveal your transaction to the Reveal Contract which calls the Submarine Contract.

Once the swap takes place on the Submarine contract, it will self-destruct (yes, just like in Mission Impossible).

```shell
npx hardhat run --network goerli scripts/step6.ts
```

### Step 7

Congratulations, once your transaction above goes through, you can then check your account balance for Ether and also
the USDC testnet token (our SWAP_TOKEN). If you decide to change your token, just update the decimals from 6 on row 39 of the step7 file to 18 for example (or whatever the number of decimals are for the token you are swapping for).

This is because USDC uses 6 decimals. Failing to do this will not be severe, it just means the formatting of the amount in your wallet will be wrong.

You can also add the USDC token address to your Metamask on Goerli testnet. The amount will show in there.

```shell
npx hardhat run --network goerli scripts/step7.ts
```

### CONGRATULATIONS! You can now edit the code and repeat all steps to make sure it is working for your unique requirements.
