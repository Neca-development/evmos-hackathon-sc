import hre from "hardhat";
export async function verifyContract(address: string, ...constructorArguments: any) {
    console.log('Wait a minute for changes to propagate to Etherscan\'s backend...');
    // await waitAMinute();
    console.log('Verifying contract...');
    await hre.run('verify:verify', {
        address,
        constructorArguments: [...constructorArguments],
    });
    console.log('Contract verified on Etherscan :белая_галочка:');
}


// export function waitAMinute() {
//     return new Promise(resolve => setTimeout(resolve, 60000));
// }
 verifyContract('0xA30b18aF93c9994eABBf058bF86625A48D246Ee1', "0xce26cE7b50c23268e7a45988c70086a86ddA1f37", "0x83265ff5d5Ca85c3BeB9e9bd4C285C14Cfa0C906")
// verifyContract('0xA30b18aF93c9994eABBf058bF86625A48D246Ee1')