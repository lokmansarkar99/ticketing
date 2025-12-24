export const dynamicSeatAllocationForReport = (coachClass:any) => {
    const seats = [];
  
    if (coachClass === "E_Class") {
      // E_Class: 2 left, 2 right, 41 seats total, with last row having 5 seats
      for (let i = 0; i < 9; i++) {
        seats.push({ seat: `${String.fromCharCode(65 + i)}1` });
        seats.push({ seat: `${String.fromCharCode(65 + i)}2` });
        seats.push({ seat: `${String.fromCharCode(65 + i)}3` });
        seats.push({ seat: `${String.fromCharCode(65 + i)}4` });
      }
      seats.push({ seat: `J1` }, { seat: `J2` }, { seat: `J3` }, { seat: `J4` }, { seat: `J5` });
    } else if (coachClass === "B_Class") {
      // B_Class: 3 seats per row from A1 to I3, plus an extra seat I4 for a total of 28 seats
      for (let i = 0; i < 9; i++) {
        const rowLetter = String.fromCharCode(65 + i); // A, B, C, ..., H, I
        seats.push({ seat: `${rowLetter}1` });
        seats.push({ seat: `${rowLetter}2` });
        seats.push({ seat: `${rowLetter}3` });
      }
      seats.push({ seat: `I4` }); // Adding extra seat to make 28 total
    } else if (coachClass === "Sleeper") {
      // Sleeper class: Lower deck with 3 seats per row from A1 to E3
      for (let i = 0; i < 5; i++) {
        const rowLetter = String.fromCharCode(65 + i); // A, B, C, D, E
        seats.push({ seat: `L-${rowLetter}1` });
        seats.push({ seat: `L-${rowLetter}2` });
        seats.push({ seat: `L-${rowLetter}3` });
      }
  
      // Upper deck: 3 seats per row from A4 to E6
      for (let i = 0; i < 5; i++) {
        const rowLetter = String.fromCharCode(65 + i); // A, B, C, D, E
        seats.push({ seat: `U-${rowLetter}4` });
        seats.push({ seat: `U-${rowLetter}5` });
        seats.push({ seat: `U-${rowLetter}6` });
      }
    } else if (coachClass === "S_Class") {
      // S_Class: Rows A to H with 3 seats each: A1, A2, A3 ... H1, H2, H3
      for (let i = 0; i < 8; i++) {
        const rowLetter = String.fromCharCode(65 + i); // A, B, C, ..., H
        seats.push({ seat: `L-${rowLetter}1` });
        seats.push({ seat: `L-${rowLetter}2` });
        seats.push({ seat: `L-${rowLetter}3` });
      }
  
      // Special row I with 4 seats: I1, I2, I3, I4
      seats.push({ seat: `L-I1` });
      seats.push({ seat: `L-I2` });
      seats.push({ seat: `L-I3` });
      seats.push({ seat: `L-I4` });
  
      // Second set rows A to E with 3 seats each: A4, A5, A6 ... E4, E5, E6
      for (let i = 0; i < 5; i++) {
        const rowLetter = String.fromCharCode(65 + i); // A, B, C, D, E
        seats.push({ seat: `U-${rowLetter}4` });
        seats.push({ seat: `U-${rowLetter}5` });
        seats.push({ seat: `U-${rowLetter}6` });
      }
    }
  
    return seats;
  };
  