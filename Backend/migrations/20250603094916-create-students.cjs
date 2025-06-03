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
    await queryInterface.createTable('students', {
      student_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      student_name: { type: Sequelize.STRING(50), allowNull: false },
      roll_number: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      cnic: { type: Sequelize.STRING(20), allowNull: false },
      phone_number: { type: Sequelize.STRING(20), allowNull: false },
      department: { type: Sequelize.STRING(50), allowNull: false },
      semester: { type: Sequelize.STRING(10), allowNull: false },
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
    await queryInterface.dropTable('students');
  }
};
