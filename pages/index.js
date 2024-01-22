import React, { useEffect, useState } from 'react'
import FormSubmission from './components/FormSubmission';
import Intro from './components/Intro';
import Image from 'next/image';
import goTrain from '../public/goTrain.webp';
import logo from '../public/logo.jpg'
import Footer from './components/Footer';
import Spacer from './components/Spacer';

function index() {


  return (
    <>
    <div id='web-content'>
      <br/>
      <br/>
      <Image style={{ borderRadius: '10px', border: '2px solid black' }} src={logo} width={400} alt='Go Fare Calculator' />
      <Intro />
      <div className='container'>
        <Image style={{ borderRadius: '20px' }}src={goTrain} width={500} alt='Go Train' />
        <FormSubmission />
      </div>
      <br/>
    </div>
    <Spacer />
    <Footer id='footer' />
    </>
  )
}

export default index