import getConfig from './config';
import * as nearAPI from 'near-api-js';

const nearConfig = getConfig('testnet');

export async function initContract() {
    const near = await nearAPI.connect({
        deps: {
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
        },
        ...nearConfig,
    });

    const walletConnection = new nearAPI.WalletConnection(near);

    let currentUser;

    // Account.state();

    if (walletConnection.getAccountId()) {
        currentUser = {
            accountId: walletConnection.getAccountId(),
            balance: (await walletConnection.account().state()).amount,
        };
    }

    const contract = await new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
        viewMethods: [
            'get_forms',
            'get_form_count',
            'get_form',
            'get_element',
            'get_elements',
            'get_element_count',
            'get_participants',
            'get_question_count',
            'get_joined_forms',
        ],
        changeMethods: [
            'init_new_form',
            'publish_form',
            'unpublish_form',
            'join_form',
            'new_element',
            'submit_answer',
            'update_element',
            'update_form',
            'delete_form',
            'delete_element',
            'get_answer_statistical',
        ],
        sender: walletConnection.getAccountId(),
    });

    return { contract, currentUser, nearConfig, walletConnection };
}
