import React from 'react';
import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import { Fade } from 'react-awesome-reveal';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import '../../assets/css/footer.css';

const Footer = () => {
  return (
    <Fade triggerOnce direction="up">
      <Box component="footer" className="footer" sx={{ bgcolor: '#333', py: 3, color: '#fff' }}>
        <Container maxWidth="lg" className="container">
          <Typography variant="body2" color="inherit" align="center" gutterBottom>
            &copy; {new Date().getFullYear()} Speed wash All rights reserved.
          </Typography>
          <Box component="ul" sx={{ display: 'flex', justifyContent: 'center', p: 0, listStyle: 'none' }}>
            <Box component="li" sx={{ mx: 2 }}>
              <MuiLink href="/terms" color="inherit" underline="hover">
                Terms of Service
              </MuiLink>
            </Box>
            <Box component="li" sx={{ mx: 2 }}>
              <MuiLink href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </MuiLink>
            </Box>
            <Box component="li" sx={{ mx: 2 }}>
              <MuiLink href="/contact" color="inherit" underline="hover">
                Contact Us
              </MuiLink>
            </Box>
            <Box component="li" sx={{ mx: 2 }}>
              <MuiLink href="/address" color="inherit" underline="hover">
                Address
              </MuiLink>
            </Box>
          </Box>

          {/* Social Media Links */}
          <Box className="social-icons" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <MuiLink href="https://facebook.com" color="inherit" target="_blank" rel="noopener">
              <Facebook />
            </MuiLink>
            <MuiLink href="https://twitter.com" color="inherit" target="_blank" rel="noopener">
              <Twitter />
            </MuiLink>
            <MuiLink href="https://instagram.com" color="inherit" target="_blank" rel="noopener">
              <Instagram />
            </MuiLink>
            <MuiLink href="https://linkedin.com" color="inherit" target="_blank" rel="noopener">
              <LinkedIn />
            </MuiLink>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default Footer;
