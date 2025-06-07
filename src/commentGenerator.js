function generateSwaggerComment({ method, path, config }) {
  const lines = [];
  lines.push('/**');
  lines.push(' * @swagger');
  lines.push(` * ${path}:`);
  lines.push(` *   ${method}:`);
  
  // Summary
  if (config.summary) {
    lines.push(` *     summary: ${config.summary}`);
  }

  // Tags
  if (config.tags?.length) {
    lines.push(' *     tags:');
    config.tags.forEach(tag => lines.push(` *       - ${tag}`));
  }

  // Parameters
  if (config.params?.length) {
    lines.push(' *     parameters:');
    config.params.forEach(param => {
      lines.push(` *       - name: ${param.name}`);
      lines.push(` *         in: ${param.in}`);
      lines.push(` *         required: ${param.required}`);
      if (param.description) {
        lines.push(` *         description: ${param.description}`);
      }
      lines.push(` *         schema:`);
      lines.push(` *           type: ${param.schema.type}`);
    });
  }

  // Request Body
  if (config.requestBody) {
    lines.push(' *     requestBody:');
    if (config.requestBody.description) {
      lines.push(` *       description: ${config.requestBody.description}`);
    }
    lines.push(` *       required: ${config.requestBody.required}`);
    lines.push(' *       content:');
    lines.push(' *         application/json:');
    lines.push(' *           schema:');
    lines.push(' *             type: object');
    lines.push(' *             properties:');
    
    Object.entries(config.requestBody.content['application/json'].schema.properties)
      .forEach(([name, def]) => {
        lines.push(` *               ${name}:`);
        lines.push(` *                 type: ${def.type}`);
      });
      
    if (config.requestBody.content['application/json'].schema.required?.length) {
      lines.push(' *             required:');
      config.requestBody.content['application/json'].schema.required
        .forEach(field => lines.push(` *               - ${field}`));
    }
  }

  // Responses
  if (Object.keys(config.responses).length) {
    lines.push(' *     responses:');
    Object.entries(config.responses).forEach(([code, response]) => {
      lines.push(` *       ${code}:`);
      if (response.description) {
        lines.push(` *         description: ${response.description}`);
      }
      if (response.content) {
        lines.push(' *         content:');
        lines.push(' *           application/json:');
        lines.push(' *             schema:');
        lines.push(' *               type: object');
        lines.push(' *               properties:');
        
        Object.entries(response.content['application/json'].schema.properties)
          .forEach(([name, def]) => {
            lines.push(` *                 ${name}:`);
            lines.push(` *                   type: ${def.type}`);
          });
      }
    });
  }

  lines.push(' */');
  return lines.join('\n');
}

module.exports = { generateSwaggerComment };