import { browser } from '@wdio/globals'
import { expect } from 'chai'
import {getRandomNum} from '../utils/randomNum.js'
import LoginPage from '../pageobjects/login.page.js'
import HomePage from '../pageobjects/home.page.js'
import SignUpPage from '../pageobjects/signup.page.js'

describe('Login Tests', () => {

    before('', async()=> {
        await LoginPage.open() 
        await LoginPage.initialize()
        await SignUpPage.initialize()
        await HomePage.initialize()  
    })
    
    it('should get error with invalid credentils ', async () => {
        await LoginPage.login( 'xzsgdgdg', 'gdxdfd' )
        const error = LoginPage.errorMsg
        await error.waitForDisplayed()
        expect(await error.getText()).to.equal('vfgIncorrect username or password')
    })

    it('should login with valid credentials', async () => {
        await LoginPage.login( process.env.email, process.env.password )
        await HomePage.addContactBtn.waitForDisplayed()
        const homePageHeader = await HomePage.homePageTitle.getText()
        expect(homePageHeader).to.equal('Contact List')
        await HomePage.logoutBtn.click()
    })

    it('should register new user', async () => {
        await LoginPage.signUpBtn.click()
        const newUserEmail = `user-${getRandomNum()}@gmail.com`
        const newUserPassword = `user-${getRandomNum()}1234.`
        await SignUpPage.fillSignUpForm(newUserEmail, newUserPassword)
        await HomePage.addContactBtn.waitForDisplayed()
        const homePageHeader = await HomePage.homePageTitle.getText()
        expect(homePageHeader).to.equal('Contact List')
        await HomePage.logoutBtn.click()
    })

    it('should get error for registering new user with existing email', async () => {
        await LoginPage.signUpBtn.click()
        await SignUpPage.fillSignUpForm( process.env.email, process.env.password)
        const error = SignUpPage.errorMsg
        await error.waitForDisplayed()
        expect(await error.getText()).to.equal('Email address is already in use')
    })

})

