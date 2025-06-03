'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      item_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'room_id' },
        onDelete: 'CASCADE'
      },
      item_name: { type: Sequelize.STRING(50), allowNull: false },
      item_condition: { type: Sequelize.STRING(20), allowNull: false },
      last_checked_date: { type: Sequelize.DATEONLY, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  }
};
