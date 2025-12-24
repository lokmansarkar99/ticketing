export type Coach = {
  id: number;
  coachNo: string;
  schedule: string;
  noOfSeat: number;
  active: boolean;
  createdAt: string;
  fare: {
    amount: number;
  };
  fromCounter: {
    name: string;
    address: string;
  };
  destinationCounter: {
    name: string;
    address: string;
  };
  route: {
    routeName: string;
  };
};

