import { z } from 'zod'

// Pure function - Schema for fallback PureGym data
export const FallbackPureGymSchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  amenities: z.array(z.string()).default([]),
})

// Pure function - Default PureGym amenities
export function getDefaultPureGymAmenities(): string[] {
  return [
    'Weights',
    'Cardio Equipment',
    'Functional Training Area',
    'Free Wi-Fi',
    '24/7 Access',
    'CCTV Security',
    'Air Conditioning',
    'Changing Rooms',
    'Lockers',
    'Water Stations'
  ]
}

// Pure function - Known PureGym locations across the UK as fallback data
export function getFallbackPureGymLocations(): z.infer<typeof FallbackPureGymSchema>[] {
  return [
    {
      name: "PureGym London Bank",
      address: "86-90 Cannon Street, London EC4N 6HA",
      latitude: 51.5127,
      longitude: -0.0907,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym London Liverpool Street",
      address: "1 Appold Street, London EC2A 2UU",
      latitude: 51.5194,
      longitude: -0.0831,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Manchester City Centre",
      address: "Portland Street, Manchester M1 3LA",
      latitude: 53.4794,
      longitude: -2.2453,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Birmingham City Centre",
      address: "52-58 New Street, Birmingham B2 4BA",
      latitude: 52.4796,
      longitude: -1.8951,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Leeds City Centre",
      address: "Merrion Centre, Leeds LS2 8NG",
      latitude: 53.8059,
      longitude: -1.5509,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Liverpool City Centre",
      address: "14-18 Renshaw Street, Liverpool L1 2SJ",
      latitude: 53.4084,
      longitude: -2.9844,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Glasgow City Centre",
      address: "220 Buchanan Street, Glasgow G1 2GF",
      latitude: 55.8609,
      longitude: -4.2514,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Edinburgh City Centre",
      address: "108 Rose Street, Edinburgh EH2 3JF",
      latitude: 55.9533,
      longitude: -3.1883,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Newcastle City Centre",
      address: "45-51 Grainger Street, Newcastle NE1 5JE",
      latitude: 54.9738,
      longitude: -1.6131,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Bristol City Centre",
      address: "The Galleries, Broadmead, Bristol BS1 3XD",
      latitude: 51.4545,
      longitude: -2.5879,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Cardiff City Centre",
      address: "Queen Street, Cardiff CF10 2BY",
      latitude: 51.4816,
      longitude: -3.1791,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Sheffield City Centre",
      address: "The Moor, Sheffield S1 4PF",
      latitude: 53.3781,
      longitude: -1.4598,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Leicester City Centre",
      address: "Gallowtree Gate, Leicester LE1 5AD",
      latitude: 52.6369,
      longitude: -1.1398,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Nottingham City Centre",
      address: "Victoria Centre, Nottingham NG1 3QN",
      latitude: 52.9548,
      longitude: -1.1581,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Norwich City Centre",
      address: "Chapelfield, Norwich NR2 1SU",
      latitude: 52.6309,
      longitude: 1.2974,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Oxford City Centre",
      address: "Westgate Centre, Oxford OX1 1TR",
      latitude: 51.7520,
      longitude: -1.2577,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Reading City Centre",
      address: "The Oracle, Reading RG1 2AG",
      latitude: 51.4543,
      longitude: -0.9781,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Cambridge City Centre",
      address: "Grand Arcade, Cambridge CB2 3BJ",
      latitude: 52.2053,
      longitude: 0.1218,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Portsmouth City Centre",
      address: "Commercial Road, Portsmouth PO1 4BU",
      latitude: 50.8198,
      longitude: -1.0880,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Southampton City Centre",
      address: "West Quay, Southampton SO15 1QD",
      latitude: 50.9097,
      longitude: -1.4044,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Brighton City Centre",
      address: "Churchill Square, Brighton BN1 2RG",
      latitude: 50.8225,
      longitude: -0.1372,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Milton Keynes",
      address: "Midsummer Boulevard, Milton Keynes MK9 2EA",
      latitude: 52.0406,
      longitude: -0.7594,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Coventry City Centre",
      address: "West Orchards, Coventry CV1 1QX",
      latitude: 52.4081,
      longitude: -1.5106,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Stoke-on-Trent",
      address: "The Potteries Centre, Stoke-on-Trent ST1 1PS",
      latitude: 53.0282,
      longitude: -2.1831,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Derby City Centre",
      address: "Intu Derby, Derby DE1 2PQ",
      latitude: 52.9225,
      longitude: -1.4746,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Hull City Centre",
      address: "Prospect Centre, Hull HU2 8PW",
      latitude: 53.7456,
      longitude: -0.3367,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym York City Centre",
      address: "Coney Street, York YO1 9QL",
      latitude: 53.9591,
      longitude: -1.0815,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Exeter City Centre",
      address: "Princesshay, Exeter EX1 1GE",
      latitude: 50.7236,
      longitude: -3.5275,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Plymouth City Centre",
      address: "Drake Circus, Plymouth PL1 1EA",
      latitude: 50.3755,
      longitude: -4.1427,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Bournemouth",
      address: "Old Christchurch Road, Bournemouth BH1 1DH",
      latitude: 50.7192,
      longitude: -1.8808,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Bath City Centre",
      address: "SouthGate, Bath BA1 1AP",
      latitude: 51.3811,
      longitude: -2.3590,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Swindon",
      address: "The Parade, Swindon SN1 1BA",
      latitude: 51.5557,
      longitude: -1.7797,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Gloucester",
      address: "Eastgate Centre, Gloucester GL1 1RU",
      latitude: 51.8642,
      longitude: -2.2444,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Northampton",
      address: "Grosvenor Centre, Northampton NN1 2EL",
      latitude: 52.2405,
      longitude: -0.8930,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Peterborough",
      address: "Queensgate Centre, Peterborough PE1 1NT",
      latitude: 52.5755,
      longitude: -0.2405,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Ipswich",
      address: "Westgate Centre, Ipswich IP1 3EL",
      latitude: 52.0567,
      longitude: 1.1482,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Canterbury",
      address: "Whitefriars Centre, Canterbury CT1 2TF",
      latitude: 51.2802,
      longitude: 1.0789,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Wolverhampton",
      address: "Mander Centre, Wolverhampton WV1 3NH",
      latitude: 52.5842,
      longitude: -2.1284,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Bradford",
      address: "The Broadway, Bradford BD1 1JF",
      latitude: 53.7960,
      longitude: -1.7594,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Stockport",
      address: "Merseyway Centre, Stockport SK1 1PJ",
      latitude: 53.4106,
      longitude: -2.1575,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Warrington",
      address: "Golden Square, Warrington WA1 1QB",
      latitude: 53.3900,
      longitude: -2.5970,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Lincoln",
      address: "High Street, Lincoln LN5 7AT",
      latitude: 53.2307,
      longitude: -0.5406,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Cannock",
      address: "Market Hall, Cannock WS11 1EB",
      latitude: 52.6906,
      longitude: -2.0319,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Aberdeen City Centre",
      address: "Union Street, Aberdeen AB10 1HE",
      latitude: 57.1497,
      longitude: -2.0943,
      amenities: getDefaultPureGymAmenities()
    },
    {
      name: "PureGym Belfast City Centre",
      address: "Victoria Square, Belfast BT1 4QG",
      latitude: 54.5973,
      longitude: -5.9301,
      amenities: getDefaultPureGymAmenities()
    }
  ].map(gym => FallbackPureGymSchema.parse(gym))
} 