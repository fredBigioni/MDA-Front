import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = props => {
  return (
    <ContentLoader
      width={300}
      height={360}
      viewBox="0 0 280 360"
      backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
      {...props}
    >
      <rect x="0" y="10" rx="3" ry="3" width="280" height="25" />
      
      <rect x="0" y="40" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="40" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="60" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="60" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="80" rx="3" ry="3" width="8" height="8" />      
      <rect x="11" y="80" rx="3" ry="3" width="265"height="8" />

      <rect x="0" y="100" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="100" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="120" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="120" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="140" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="140" rx="3" ry="3" width="265"height="8" />

      <rect x="0" y="160" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="160" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="180" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="180" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="200" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="200" rx="3" ry="3" width="265"height="8" />

      <rect x="0" y="220" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="220" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="240" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="240" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="260" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="260" rx="3" ry="3" width="265"height="8" />

      <rect x="0" y="280" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="280" rx="3" ry="3" width="265"height="8" />
      
     <rect x="0" y="300" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="300" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="320" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="320" rx="3" ry="3" width="265"height="8" />      

      <rect x="0" y="340" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="340" rx="3" ry="3" width="265"height="8" />
      
      <rect x="0" y="360" rx="3" ry="3" width="8" height="8" />
      <rect x="11" y="360" rx="3" ry="3" width="265"height="8" />
    </ContentLoader>
  )
}

export default Loader