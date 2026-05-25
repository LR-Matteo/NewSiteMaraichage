'use client';
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { setORSPalette } from './shared';
import { SiteResponsive } from './site-responsive';

setORSPalette('foret');
const TWEAKS = { productGrid: 'cartes', palette: 'foret' };

export default function SiteWrapper() {
  useEffect(() => {
    emailjs.init({ publicKey: 'Wzh4qhoxE1qC-vlnj' });
  }, []);

  return <SiteResponsive tweaks={TWEAKS} />;
}
