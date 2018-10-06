import React from 'react';
import { SyncLoader } from 'react-spinners';

const Spiner = () => (
    <div className="spinner">
        <SyncLoader color={'#1eaedb'} size={30} margin={'3px'}/>
    </div>
)
 
export default Spiner;