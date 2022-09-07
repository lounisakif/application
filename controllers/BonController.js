const knex = require('../db/knex')
   const jwt = require('jsonwebtoken')
     //new devis
// const addBon = async (req,res)=>{
//     try {
//       const thisDate= new Date()
//       thisDate.setDate(thisDate.getDate())
     
//       let  datee = (thisDate.getUTCDate())+ "/" + (thisDate.getMonth() + 1)+ "/" + (thisDate.getUTCFullYear()) ;
 
//         const panier=req.body.cart
//         const idUser=req.body.id_user
//         const adresse= req.body.adresse
//         const typeBon=req.body.type_bon


      
        
//         await knex('bon')
//         .returning(['id','type_bon'])
//         .insert({
//             id_user:idUser,
//             date:datee,
//             type_bon: typeBon
            
//         }).then((result)=>{
//             result.map((r) => {
//                 panier.map(async(element)=>{
//                     await knex('element')
//                     .returning(['id_ingredient','quantity'])
//                     .insert({
//                         id_ingredient:element.ingredient,
                        
//                         id_bon: r.id,
//                         quantity: element.quantity
//                     }).then((res)=>{
//                         res.map((s)=>{
//                             if (r.type_bon =='reception'){
//                                 // knex('stock')
//                                 // .where('adresse', '=', adresse).where('id_ingredient','=',s.id_ingredient)
//                                 // .update({
//                                 //   '	quantity': knex.raw('	quantity + ' + s.quantity)
//                                 // }) 
//                                 knex('stock')
//                                 .where('adresse', '=', adresse).where('id_ingredient','=',s.id_ingredient)
//                                  .increment('quantity', s.quantity)
//                             }
                        
                          
//                         })
//                     }
                    
                    
//                     )
                  

//                 })


//             })
//             res.status(200).send({ msg: 'ajouté avec succès' });
//         })

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('erreur serveur');
//     }
// };
// const addBonR = async (req,res)=>{
// try {
//     const thisDate= new Date()
//     thisDate.setDate(thisDate.getDate())
   
//     let  datee = (thisDate.getUTCDate())+ "/" + (thisDate.getMonth() + 1)+ "/" + (thisDate.getUTCFullYear()) ;

//       const panier=req.body.cart
//       const idUser=req.body.id_user
//       const adresse= req.body.adresse
  
//       await knex('bon')
//       .returning(['id'])
//       .insert({
//           id_user:idUser,
//           date:datee,
//           type_bon: 'reception'
          
//       }).then((result)=>{
//           result.map((r) => {
//               panier.map(async(element)=>{
//                   await knex('element')
//                   .returning(['id_ingredient','quantity'])
//                   .insert({
//                       id_ingredient:element.ingredient,
                      
//                       id_bon: r.id,
//                       quantity: element.quantity
//                   }).then((res)=>{
//                       res.map((s)=>{
//                               knex('stock')
//                               .where('adresse', '=', adresse).where('id_ingredient', '=', s.id_ingredient)
//                       })
//                   }   
//                   )
//  })


//           })
//           res.status(200).send({ msg: 'ajouté avec succès' });
//       })

// } catch (err) {
//     console.error(err.message);
//     res.status(500).send('erreur serveur');
// }
// }
const addBonR = async (req,res)=>{
  try {
    const thisDate= new Date()
    thisDate.setDate(thisDate.getDate())
   
    let  datee = (thisDate.getUTCDate())+ "/" + (thisDate.getMonth() + 1)+ "/" + (thisDate.getUTCFullYear()) ;

      const panier=req.body.panier
      
      console.log(req.body.adresseD)
      const idUser=req.body.idUser
      const adresse= req.body.adresse
    
     
      await knex('bon')
      .returning('id')
      .insert({
          id_user:idUser,
          date:datee,
          type_bon: 'reception'
          
      }).then((result)=>{
        
       
              panier.map(async(element)=>{
             
                  await knex('element')
                  .returning(['id'])
                  .insert({
                      id_ingredient:element.code_interne,
                      id_bon: result,
                      quantity: element.quantity
                  }).then((res)=>{
                  console.log(res)
                   knex.select('id_ingredient', 'quantity').from('element').where('id', res)
                   .then((result)=>{
                    console.log("res")
                    console.log(result)
                    result.map(async(r)=>{
                      const ing = await knex.select().from('stock').where('id_ingredient', r.id_ingredient).then((ing) => { return ing[0] }) // chercher l'utilisateur dans la base de données
                      if (!ing) {
                        await knex('stock').insert([{
                          adresse: adresse,
                          id_ingredient: r.id_ingredient,
                          quantity:r.quantity
                        }])
                  
                      }else{
                        await knex('stock')
                        .where('adresse', '=', adresse).where('id_ingredient', '=',  r.id_ingredient)
                        .increment('quantity', r.quantity)
                      }
 
                      
                    })
                    
                   })
                     
                  }   
                  )
 })


          
          res.status(200).send({ msg: 'ajouté avec succès' });
      })
} catch (err) {
    console.error(err.message);
    res.status(500).send('erreur serveur');
}

}
const addBonM = async (req,res)=>{
  try {
    const thisDate= new Date()
    thisDate.setDate(thisDate.getDate())
   
    let  datee = (thisDate.getUTCDate())+ "/" + (thisDate.getMonth() + 1)+ "/" + (thisDate.getUTCFullYear()) ;

      const panier=req.body.panier
      
      console.log(req.body.adresseD)
      const idUser=req.body.idUser
      const adresse= req.body.adresse
    
     
      await knex('bon')
      .returning('id')
      .insert({
          id_user:idUser,
          date:datee,
          type_bon: 'mouvement'
          
      }).then((result)=>{
        
       
              panier.map(async(element)=>{
             
                  await knex('element')
                  .returning(['id'])
                  .insert({
                      id_ingredient:element.code_interne,
                      id_bon: result,
                      quantity: element.quantity
                  }).then((res)=>{
                  console.log(res)
                   knex.select('id_ingredient', 'quantity').from('element').where('id', res)
                   .then((result)=>{
                    console.log("res")
                    console.log(result)
                    result.map(async(r)=>{

                       
                          await knex('stock')
                          .where('adresse', '=', adresse).where('id_ingredient', '=',  r.id_ingredient)
                          .decrement  ('quantity', r.quantity)
                         
                      
                    })
                    
                   })
                     
                  }   
                  )
 })


          
          res.status(200).send({ msg: 'ajouté avec succès' });
      })
} catch (err) {
    console.error(err.message);
    res.status(500).send('erreur serveur');
}

    }
const addBonT = async (req,res)=>{

    try {
        const thisDate= new Date()
        thisDate.setDate(thisDate.getDate())
       
        let  datee = (thisDate.getUTCDate())+ "/" + (thisDate.getMonth() + 1)+ "/" + (thisDate.getUTCFullYear()) ;
    
          const panier=req.body.panier
          
          console.log(req.body.adresseD)
          const idUser=req.body.idUser
          const adresse= req.body.adresse
          const adresseD= req.body.adresseD
         
          await knex('bon')
          .returning('id')
          .insert({
              id_user:idUser,
              date:datee,
              type_bon: 'trensfert'
              
          }).then((result)=>{
            
           
                  panier.map(async(element)=>{
                 
                      await knex('element')
                      .returning(['id'])
                      .insert({
                          id_ingredient:element.code_interne,
                          id_bon: result,
                          quantity: element.quantity
                      }).then((res)=>{
                      console.log(res)
                       knex.select('id_ingredient', 'quantity').from('element').where('id', res)
                       .then((result)=>{
                        console.log("res")
                        console.log(result)
                        result.map(async(r)=>{
                              await knex('stock')
                              .where('adresse', '=', adresse).where('id_ingredient', '=',  r.id_ingredient)
                              .decrement('quantity', r.quantity)
                              await knex('stock')
                              .where('adresse', '=', adresseD).where('id_ingredient', '=',  r.id_ingredient)
                              .increment('quantity', r.quantity)
                          
                        })
                        
                       })
                         
                      }   
                      )
     })
    
    
              
              res.status(200).send({ msg: 'ajouté avec succès' });
          })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('erreur serveur');
    }
    
}
// liste des produits
const getProducts = async (req, res) => {
    try {
      const products = await knex.select().from('ingredient');
      console.log(products)
      return res.status(200).send(products);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('erreur serveur');
    }
  };
  //stock
  const getstocks= async (req, res) => {
    try {
      const products = await knex.select().from('stock');
      console.log(products)
      return res.status(200).send(products);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('erreur serveur');
    }
  };
  //stock par adresse
  const getstock= async (req, res) => {
    try {
      const products = await knex.select().from('stock').where('adresse',req.params.adresse);
      console.log(products)
      return res.status(200).send(products);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('erreur serveur');
    }
  };
module.exports = { addBonR, addBonM, addBonT,getProducts,getstock,getstocks}