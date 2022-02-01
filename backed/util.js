import getConfig from './config';
import * as nearAPI from 'near-api-js';

const nearConfig = getConfig('testnet');
// const nearConfig = getConfig('mainnet');

export async function initContract() {
    const near = await nearAPI.connect({
        deps: {
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
        },
        ...nearConfig,
    });

    const walletConnection = new nearAPI.WalletConnection(near);

    let currentUser;

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
            'get_form_status',
            'get_participant_form_status',
            'get_passed_element_count',
            'get_joined_forms_count',
            'get_event',
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
            'init_new_event',
            'publish_event',
            'join_event',
            'unpublish_event',
        ],
        sender: walletConnection.getAccountId(),
    });

    return { contract, currentUser, nearConfig, walletConnection };
}
