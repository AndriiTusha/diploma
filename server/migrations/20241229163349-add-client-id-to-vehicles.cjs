module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'client_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // або true, якщо це поле не обов'язкове
      references: {
        model: 'clients', // Назва таблиці клієнтів
        key: 'id',        // Поле, на яке посилається
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('vehicles', 'client_id');
  },
};
