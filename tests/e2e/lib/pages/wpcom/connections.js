/**
 * Internal dependencies
 */
import Page from '../page';
import {
	clickAndWaitForNewPage,
	getAccountCredentials,
	isEventuallyPresent,
} from '../../page-helper';

export default class ConnectionsPage extends Page {
	constructor( page ) {
		const expectedSelector = '.connections__sharing-connections';
		super( page, { expectedSelector, explicitWaitMS: 40000 } );
	}

	async selectMailchimpList( mailchimpList = 'e2etesting' ) {
		const loadingIndicatorSelector = '.foldable-card__summary button:not([disabled])';
		const mailchimpExpandSelector = '.mailchimp .foldable-card__expand svg[height="24"]';
		const marketingSelectSelector = '.mailchimp select';
		const mcOptionXpathSelector = `//option[contains(text(), '${ mailchimpList }')]`;
		const successNoticeSelector = `//span[contains(text(), '${ mailchimpList }')]`;

		await this.page.waitForSelector( loadingIndicatorSelector );
		await page.click( mailchimpExpandSelector );

		// If user account is already connected to Mailchimp, we don't really need to connect it once again
		// TODO: It's actually a default state, since connections are shared between sites. So we could get rid of chunk entirely
		const isConnectedAlready = await isEventuallyPresent( this.page, marketingSelectSelector, {
			timeout: 10000,
		} );
		if ( ! isConnectedAlready ) {
			await this.connectMailchimp();
		}

		// WPCOM Connections page
		await this.page.waitForSelector( mcOptionXpathSelector, { state: 'attached' } );
		await page.selectOption( marketingSelectSelector, { label: mailchimpList } );

		await this.page.waitForSelector( successNoticeSelector );
		await this.page.close();
	}

	async connectMailchimp() {
		const mailchimpConnectSelector =
			'div.mailchimp .foldable-card__summary-expanded button:not([disabled])';
		const mcPopupPage = await clickAndWaitForNewPage( this.page, mailchimpConnectSelector );

		// MC Login pop-up page. TODO: maybe extract to a new page
		const [ mcLogin, mcPassword ] = getAccountCredentials( 'mailchimpLogin' );
		// Locators
		const mcUsernameSelector = '#login #username';
		const mcPasswordSelector = '#login #password';
		const mcSubmitSelector = "#login input[type='submit']";

		await mcPopupPage.type( mcUsernameSelector, mcLogin );
		await mcPopupPage.type( mcPasswordSelector, mcPassword );
		await mcPopupPage.type( mcSubmitSelector );
	}
}
