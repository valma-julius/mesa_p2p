import React from 'react';

// Flowbite
import { Card } from 'flowbite-react';

const Main = () => {
  return (
    <div className="container mx-auto text-center">
      <h5 className="text-xl font-bold">Mesa</h5>
      <p className="text-sm mb-10">A fully P2P messenger</p>
      <div className="flex flex-row w-full justify-center gap-4">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h5>
        </Card>
      </div>
    </div>
  );
};

export default Main;
