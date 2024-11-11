import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../assets/css/Home.css'; 

import dryCleaningImage from '../../assets/images/11.jpg';
import ironingImage from '../../assets/images/w.jpg';
import shoeCleaningImage from '../../assets/images/SN.jpg';
import clothRepairImage from '../../assets/images/T.jpg';
import wash_fold from '../../assets/images/wash.jpg';
import towelMatCleaningImage from '../../assets/images/tw.jpg';
import bedcoverCleaningImage from '../../assets/images/iro.jpg';
import pickup from '../../assets/images/H3.jpg';
import deliver from '../../assets/images/H1.jpg';
import clean from '../../assets/images/H2.jpg';

const services = [
  {
    name: 'Premium Dry Cleaning',
    description: 'High-end garments requiring special care.',
    image: dryCleaningImage
  },
  {
    name: 'Wash & Fold',
    description: 'Everyday laundry made easy.',
    image: wash_fold
  },
  {
    name: 'Ironing',
    description: 'Crisp, wrinkle-free clothes.',
    image: ironingImage
  },
  {
    name: 'Shoe Cleaning',
    description: 'Professional cleaning for all types of shoes.',
    image: shoeCleaningImage
  },
  {
    name: 'Cloth Repair',
    description: 'Fix your garments with our repair services.',
    image: clothRepairImage
  },
  {
    name: 'Bedcover Cleaning',
    description: 'Fresh and clean bedcovers.',
    image: bedcoverCleaningImage
  },
  {
    name: 'Towel & Mat Cleaning',
    description: 'Keep your towels and mats fresh.',
    image: towelMatCleaningImage
  },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom className="hero-title">
            Welcome to Speed Wash
          </Typography>
          <Typography variant="h6" paragraph className="hero-subtitle">
            Discover our premium laundry services and manage your laundry with ease.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Container>
      </div>

      {/* Address and Delivery Notice Section */}
      <Box sx={{ py: 3 }} className="address-section" style={{ backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
  <Container maxWidth="lg">
    <Typography variant="h6" align="center" gutterBottom>
      <Link href="https://maps.app.goo.gl/BCqHLNsrWHV1ioys7" target="_blank" rel="noopener" underline="none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2', textDecoration: 'none' }}>
        <LocationOnIcon sx={{ mr: 1 }} />
        Location: Old Madiwala, Cashier Layout, 1st Stage, BTM Layout, Bengaluru, Karnataka 560029
      </Link>
    </Typography>
    <Typography variant="body1" align="center" style={{ color: '#555' }}>
      Online Service is available within a 30 km radius from our shop!
    </Typography>
  </Container>
</Box>




      {/* Services Section */}
      <div className="services-section">
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Our Services
          </Typography>
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            interval={3000}
            showStatus={false}
          >
            {services.map((service, index) => (
              <div key={index}>
                <div className="service-image-wrapper">
                  <img src={service.image} alt={service.name} className="service-image" />
                </div>
                <div className="legend">
                  <Typography variant="h6">{service.name}</Typography>
                  <Typography variant="body2">{service.description}</Typography>
                  <Link to="/services">
                    <Button variant="contained" color="secondary">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
        </Container>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={pickup}
                  alt="Schedule Pickup"
                  className="service-card-image"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    1. Schedule Pickup
                  </Typography>
                  <Typography variant="body2">
                    Choose your preferred time and we’ll pick up your laundry.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={clean}
                  alt="We Clean"
                  className="service-card-image"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    2. We Clean
                  </Typography>
                  <Typography variant="body2">
                    Our experts clean your laundry with the utmost care.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={deliver}
                  alt="Delivery"
                  className="service-card-image"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    3. Delivery to Your Doorstep
                  </Typography>
                  <Typography variant="body2">
                    Get your clean laundry delivered to your doorstep.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
