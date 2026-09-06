import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { apiBaseUrl } from '../data/siteData';

export default function BannerStrip() {
  const [banners, setBanners] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/banners`)
      .then((res) => res.json())
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  const visible = banners.filter((b) => !dismissed.includes(b.id));
  if (visible.length === 0) return null;

  return (
    <Box>
      {visible.map((banner) => (
        <Box key={banner.id} sx={{ position: 'relative' }}>
          <Box
            component={banner.linkUrl ? 'a' : 'div'}
            href={banner.linkUrl || undefined}
            target={banner.linkUrl ? '_blank' : undefined}
            rel={banner.linkUrl ? 'noreferrer' : undefined}
            sx={{ display: 'block' }}
          >
            <Box component="img" src={banner.imageUrl} alt={banner.title} sx={{ width: '100%', display: 'block' }} />
          </Box>
          <IconButton
            onClick={() => setDismissed((prev) => [...prev, banner.id])}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
