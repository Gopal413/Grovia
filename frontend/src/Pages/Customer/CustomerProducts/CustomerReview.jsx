// import React, { useEffect, useState } from 'react'
// import api from '../../../api/axiosConfig'
// import { Box, Typography } from '@mui/material';

// function CustomerReview() {

//     const [reviews,setReview] =useState([
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//     ])

//     // async function getReview() {
    
//     //     let response = await api.get('/customer/review')
//     //     console.log("review data",response.data);
//     //     setReview(response.data || reviews)

//     // }

//     // useEffect(()=>{
//     //     getReview();
//     // },[])

//   return (
//     <Box>
//         <h1>Welcome to review</h1>
//         {reviews.map((item)=>{
//             <Box>
//                 <Typography>
//                     {item.url} + {item.name} +{item.date} 
//                 </Typography>
//                 <Typography>
//                     {item.rating}+{item.comment}
//                 </Typography>
//             </Box>
//         })}

//     </Box>
//   )
// }

// export default CustomerReview


import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Rating, 
  Stack 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Using MUI's latest responsive Grid

function CustomerReview(props) {
  const { productId } = props;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/review/product/${productId}`);
        if (response.data.success) {
          const formattedData = response.data.data.map(item => ({
            ...item,
            name: item.userId?.name || 'Anonymous',
            date: new Date(item.createdAt).toLocaleDateString(),
            rating: parseFloat(item.rating) || 0,
            comment: item.review
          }));
          setReviews(formattedData);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, [productId]);

  return (
    <Box sx={{ p: { xs: 2 }, maxWidth: '1200px', mt: 3 }}>

      {/* Responsive Grid System: Stacks on mobile, splits into 2 on tablet, splits into 3 on desktop */}
      {loading ? (
        <Typography>Loading reviews...</Typography>
      ) : reviews.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #E8F5E9' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B5E20' }}>No Reviews Yet</Typography>
          <Typography color="text.secondary">Be the first to share your thoughts on this product!</Typography>
        </Card>
      ) : (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {reviews.map((item, index) => (
          <Grid size={{ xs: 12}} key={item._id || index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4, // Softer, more modern rounded corners
                border: '1px solid #E8F5E9', // Soft light green border hint
                boxShadow: '0px 4px 20px rgba(46, 125, 50, 0.03)', // Subtle healthy tinted shadow
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0px 12px 24px rgba(46, 125, 50, 0.08)',
                  borderColor: '#A5D6A7' // Highlights border color on hover
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                
                {/* User Header Info */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar 
                    src={item.userId?.profilePicture} // Assuming you might have a user profile picture
                    alt={item.name} 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: '#4CAF50', // Nutritious theme colored avatar background fallback
                      fontWeight: 600 
                    }}
                  >
                    {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#1B5E20' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Verified Buyer • {item.date}
                    </Typography>
                  </Box>
                </Stack>

                {/* Rating Component */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Rating 
                    value={parseFloat(item.rating)} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                    sx={{ color: '#FFB300' }} // Bright gold star color
                  />
                  <Typography variant="caption" sx={{ ml: 1, fontWeight: 700, color: 'text.primary' }}>
                    {item.rating}
                  </Typography>
                </Box>

                {/* The Food Review Comment */}
                <Typography 
                  variant="body2" 
                  color="text.primary" 
                  sx={{ 
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    color: '#37474F',
                    flexGrow: 1 // Ensures review text aligns properly if comments are different lengths
                  }}
                >
                  "{item.comment?.trim()}"
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}
    </Box>
  );
}

export default CustomerReview;
