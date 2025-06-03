'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('rooms', {
      room_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      block: { type: Sequelize.STRING(20), allowNull: false },
      floor: { type: Sequelize.INTEGER, allowNull: false },
      room_type: { type: Sequelize.STRING(20), allowNull: false },
      max_capacity: { type: Sequelize.INTEGER, allowNull: false },
      current_occupancy: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('rooms');
  }
};
