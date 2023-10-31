const models = require('../models')
const _ = require('lodash')

async function upsert(model, payload, transaction, context = {}) {
  try {
    const id = _.get(payload, 'id')
    let instance
    if (payload.toJSON) {
      payload = payload.toJSON()
    }

    payload.updatedBy = context.userId
    payload.updatedAt = new Date()
    if (id) {
      /* Check if the id is correct */
      instance = await models[model].findOne({
        where: {
          id
        },
        transaction
      })
      if (!instance) {
        throw new Error('Record not found')
      }
      /* Update if the id is correct */
      instance.set(payload)
      instance = await instance.save({
        transaction
      })
      if (context.afterUpdate) {
        await context.afterUpdate(instance, {
          transaction
        })
      }
    } else {
      /* Create new record in the DB */
      payload.createdBy = context.userId
      payload.createdAt = new Date()
      instance = await models[model].create(payload, {
        transaction
      })
      if (context.afterCreate) {
        await context.afterCreate(instance, {
          transaction
        })
      }
    }
    /* Return entire object */
    return instance
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = exports = {
  upsert
}